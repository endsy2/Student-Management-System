'use client';

import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-gray-700">{label}</span>}
      <select
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
