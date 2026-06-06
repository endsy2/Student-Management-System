'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className = '', id, ...props },
  ref,
) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-gray-700">{label}</span>}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-brand focus:ring-1 focus:ring-brand ${className}`}
        {...props}
      />
    </label>
  );
});
