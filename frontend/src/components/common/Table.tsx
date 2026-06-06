import { Loading } from './Loading';

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function Table<T>({
  columns,
  rows,
  loading,
  empty = 'No records.',
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: string;
  rowKey: (row: T) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className={`px-4 py-3 font-medium ${c.className ?? ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <Loading />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((c) => (
                  <td key={c.header} className={`px-4 py-3 ${c.className ?? ''}`}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
