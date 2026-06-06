import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../config/constants.dart';
import '../config/environment.dart';
import 'local_storage.service.dart';

/// Connection lifecycle, surfaced to the UI via [SocketService.status].
enum SocketStatus { disconnected, connecting, connected, error }

/// Wraps the Socket.io client used for the real-time attendance feed.
///
/// The backend (`backend/src/config/socket.ts`) authenticates the handshake via
/// `auth: { token }` and emits `attendance:update` to the `class:{classId}`
/// room after a client emits `attendance:join`.
///
/// This wrapper:
/// - connects lazily and authenticates with the stored access token,
/// - keeps a single `attendance:update` listener (no duplicates on re-join),
/// - remembers the joined room and **re-joins automatically on reconnect**,
/// - exposes connection [status] so widgets can show a live/offline indicator.
class SocketService {
  SocketService({required LocalStorageService storage}) : _storage = storage;

  final LocalStorageService _storage;
  io.Socket? _socket;
  String? _room;

  /// Observable connection state for the UI.
  final ValueNotifier<SocketStatus> status =
      ValueNotifier<SocketStatus>(SocketStatus.disconnected);

  bool get isConnected => _socket?.connected ?? false;

  /// Establishes the connection (idempotent).
  Future<void> connect() async {
    if (_socket != null) return;

    final token = await _storage.accessToken;
    status.value = SocketStatus.connecting;

    final socket = io.io(
      Environment.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .enableReconnection()
          .setAuth({'token': token})
          .build(),
    );

    socket.onConnect((_) {
      status.value = SocketStatus.connected;
      // Re-subscribe to the room after a (re)connect.
      final room = _room;
      if (room != null) {
        socket.emit(AppConstants.socketAttendanceJoin, room);
      }
    });
    socket.onDisconnect((_) => status.value = SocketStatus.disconnected);
    socket.onConnectError((_) => status.value = SocketStatus.error);
    socket.onError((_) => status.value = SocketStatus.error);

    _socket = socket;
    socket.connect();
  }

  /// Joins [classId]'s room and forwards `attendance:update` payloads to
  /// [onUpdate]. Safe to call repeatedly — the listener is replaced, not stacked.
  Future<void> joinClass(
    String classId, {
    required void Function(Map<String, dynamic> data) onUpdate,
  }) async {
    await connect();
    final socket = _socket!;
    _room = classId;

    socket.off(AppConstants.socketAttendanceUpdate);
    socket.on(AppConstants.socketAttendanceUpdate, (dynamic data) {
      if (data is Map) onUpdate(Map<String, dynamic>.from(data));
    });

    // If already connected, join now; otherwise onConnect handles it.
    if (socket.connected) {
      socket.emit(AppConstants.socketAttendanceJoin, classId);
    }
  }

  /// Stops listening for updates but keeps the connection open.
  void leave() {
    _socket?.off(AppConstants.socketAttendanceUpdate);
    _room = null;
  }

  /// Tears down the connection entirely (call on logout).
  void disconnect() {
    _socket?.dispose();
    _socket = null;
    _room = null;
    status.value = SocketStatus.disconnected;
  }
}
