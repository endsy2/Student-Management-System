'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { tokenStore } from '@/services/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';

/**
 * Connects to the backend Socket.io server (JWT-authenticated) and invokes
 * `onEvent` whenever `event` fires. Optionally joins a room on connect.
 */
export function useWebSocket<T = unknown>(
  event: string,
  onEvent: (payload: T) => void,
  options?: { join?: { channel: string; room: string } },
) {
  const [connected, setConnected] = useState(false);
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    const token = tokenStore.access;
    if (!token) return;

    const socket: Socket = io(SOCKET_URL, { auth: { token } });

    socket.on('connect', () => {
      setConnected(true);
      if (options?.join) socket.emit(options.join.channel, options.join.room);
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on(event, (payload: T) => handlerRef.current(payload));

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, options?.join?.room]);

  return { connected };
}
