'use client';

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';

interface Update {
  type: 'single' | 'bulk';
  record?: { studentId: string; status: string };
  count?: number;
  at: string;
}

/** Real-time feed of attendance marks for a class (Socket.io `attendance:update`). */
export function LiveAttendanceBoard() {
  const [classId, setClassId] = useState('');
  const [feed, setFeed] = useState<Update[]>([]);

  const { connected } = useWebSocket<{ type: 'single' | 'bulk'; record?: any; count?: number }>(
    'attendance:update',
    (payload) => setFeed((f) => [{ ...payload, at: new Date().toLocaleTimeString() }, ...f].slice(0, 20)),
    classId ? { join: { channel: 'attendance:join', room: classId } } : undefined,
  );

  return (
    <Card
      title="Live attendance"
      actions={
        <span className={`text-xs ${connected ? 'text-green-600' : 'text-gray-400'}`}>
          {connected ? '● live' : '○ offline'}
        </span>
      }
    >
      <div className="mb-3 max-w-xs">
        <Input
          label="Watch class ID"
          placeholder="Paste a class UUID to subscribe"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
      </div>
      {feed.length === 0 ? (
        <p className="text-sm text-gray-400">
          Marks for the watched class will stream here in real time.
        </p>
      ) : (
        <ul className="space-y-1 text-sm">
          {feed.map((u, i) => (
            <li key={i} className="flex justify-between border-b border-gray-100 py-1">
              <span>
                {u.type === 'bulk'
                  ? `Bulk: ${u.count} records`
                  : `${u.record?.studentId?.slice(0, 8)} → ${u.record?.status}`}
              </span>
              <span className="text-gray-400">{u.at}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
