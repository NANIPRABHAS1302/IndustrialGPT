import { ReactNode } from 'react';

type TableProps = {
  headers: string[];
  rows: ReactNode[];
};

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60">
      <table className="min-w-full text-sm text-slate-300">
        <thead className="bg-slate-900/70 text-left text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-800/70">
              {row}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
