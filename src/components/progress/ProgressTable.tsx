
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ProgressEntry } from "./types";
import { motion } from "framer-motion";

interface ProgressTableProps {
  filteredData: ProgressEntry[];
}

const ProgressTable: React.FC<ProgressTableProps> = ({ filteredData }) => {
  const sortedEntries = [...filteredData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto border rounded-lg"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Workout</TableHead>
            <TableHead>Form Score</TableHead>
            <TableHead>Exercise</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, index) => (
              <motion.tr 
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium">
                  {format(new Date(entry.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {entry.weight ? `${entry.weight} lbs` : "-"}
                </TableCell>
                <TableCell>{entry.workout || "-"}</TableCell>
                <TableCell>
                  {entry.formScore !== undefined ? (
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        entry.formScore >= 80 ? "text-green-600" :
                        entry.formScore >= 60 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {entry.formScore}
                      </span>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            entry.formScore >= 80 ? "bg-green-500" :
                            entry.formScore >= 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${entry.formScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell>{entry.exerciseType || "-"}</TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No entries found for this time period
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default ProgressTable;
