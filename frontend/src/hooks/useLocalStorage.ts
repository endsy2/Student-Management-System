'use client';

import { useEffect, useState } from 'react';

export function useLocalStorage(key: string, initial = ''): [string, (v: string) => void] {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) setValue(stored);
  }, [key]);

  const update = (v: string) => {
    setValue(v);
    localStorage.setItem(key, v);
  };

  return [value, update];
}
