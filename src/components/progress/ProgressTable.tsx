
import React from 'react';
import { ProgressEntry } from './types';

interface ProgressTableProps {
  filteredData: ProgressEntry[];
}

const ProgressTable: React.FC<ProgressTableProps> = ({ filteredData }) => {
  return (
    <div className="mt-4">
      <div className="overflow-auto max-h-64 rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Workout</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {filteredData.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-sm">{entry.weight} kg</td>
                <td className="px-4 py-2 text-sm">{entry.workout || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTable;
