type Variant = 'error' | 'success' | 'info' | 'warning';

const styles: Record<Variant, string> = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
};

export function Alert({ variant = 'info', children }: { variant?: Variant; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className={`mb-4 rounded-md border px-3 py-2 text-sm ${styles[variant]}`}>{children}</div>
  );
}
