'use client';

import Link from 'next/link';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  editPath?: string;
  onDelete?: (id: number) => void;
  getId: (item: T) => number;
  isDeleting?: number | null;
}

export default function DataTable<T>({
  data,
  columns,
  editPath,
  onDelete,
  getId,
  isDeleting,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {(editPath || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dejanja
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (editPath || onDelete ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Ni najdenih elementov
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = getId(item);
                return (
                  <tr key={id} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                    {(editPath || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          {editPath && (
                            <Link
                              href={`${editPath}/${id}`}
                              className="text-accent hover:text-accent/80 font-medium"
                            >
                              Uredi
                            </Link>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(id)}
                              disabled={isDeleting === id}
                              className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                            >
                              {isDeleting === id ? 'Brisanje...' : 'Izbriši'}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
