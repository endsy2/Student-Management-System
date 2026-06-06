import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { logger } from './logger';
import { socketCorsOrigin } from './cors';
import { verifyAccessToken } from '@/utils/jwt.utils';

let io: IOServer | null = null;

export function initSocket(httpServer: HttpServer): IOServer {
  io = new IOServer(httpServer, {
    cors: { origin: socketCorsOrigin, credentials: true },
  });

  // Authenticate socket connections via the same JWT access token.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Missing auth token'));
    try {
      const payload = verifyAccessToken(token);
      socket.data.user = { id: payload.sub, role: payload.role, email: payload.email };
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);
    socket.on('attendance:join', (classId: string) => socket.join(`class:${classId}`));
    socket.on('disconnect', () => logger.debug(`Socket disconnected: ${socket.id}`));
  });

  return io;
}

export function getIO(): IOServer {
  if (!io) throw new Error('Socket.io not initialised');
  return io;
}
