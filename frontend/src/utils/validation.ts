/** Lightweight client-side validators for form fields. */

export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isStrongEnoughPassword = (value: string): boolean => value.length >= 8;

export const isNonEmpty = (value: string): boolean => value.trim().length > 0;

export const isPositiveNumber = (value: string | number): boolean => {
  const n = Number(value);
  return !Number.isNaN(n) && n > 0;
};
