
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

interface FormIssue {
  part: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

interface ResultsViewProps {
  exercise: string;
  score: number;
  issues: FormIssue[];
  reps?: number;
}

const ResultsView: React.FC<ResultsViewProps> = ({ exercise, score, issues, reps }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Form Analysis</span>
            <div className="text-2xl font-bold">
              <span className={score >= 80 ? 'text-secondary' : score >= 60 ? 'text-amber-500' : 'text-destructive'}>
                {score}/100
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            {exercise} {reps ? `· ${reps} reps` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {score >= 80 && (
              <div className="flex items-center gap-2 text-secondary">
                <CheckCircle2 size={20} />
                <span className="font-medium">Great form! Keep it up.</span>
              </div>
            )}
            
            {issues.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">Form Corrections:</h3>
                {issues.map((issue, index) => (
                  <div key={index} className="border-l-2 pl-4 py-1 space-y-1" style={{
                    borderColor: issue.severity === 'high' ? 'hsl(var(--destructive))' : 
                               issue.severity === 'medium' ? 'hsl(38 92% 50%)' : 
                               'hsl(var(--secondary))'
                  }}>
                    <div className="flex items-center gap-2">
                      {issue.severity === 'high' ? (
                        <AlertTriangle size={16} className="text-destructive" />
                      ) : (
                        <ChevronRight size={16} className="text-muted-foreground" />
                      )}
                      <p className="font-medium text-sm">
                        <span className="capitalize">{issue.part}</span>: {issue.issue}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No form issues detected.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsView;
