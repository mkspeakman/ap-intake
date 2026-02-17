import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface ScheduleEntry {
  equipment_id: number;
  machine_name: string;
  job_name: string;
  quote_id: number;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'complete' | 'delayed';
  operation: string;
  part_count: number;
  estimated_hours: number;
}

interface MachineScheduleInsightsProps {
  quoteId: number;
  matchedMachineNames?: string[];
}

/**
 * PROTOTYPE: Machine Schedule Insights
 * Displays scheduling data for machines matched to a quote
 * Controlled by MACHINE_SCHEDULE_INSIGHTS feature flag
 */
export function MachineScheduleInsights({ quoteId, matchedMachineNames = [] }: MachineScheduleInsightsProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔧 MachineScheduleInsights mounted', { quoteId, matchedMachineNames });
    // Load sample schedule data
    fetch('/data/sample-schedule.json')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Schedule data loaded:', data.length, 'entries');
        setScheduleData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to load schedule data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mt-4 p-4 border border-dashed border-border/50 rounded bg-muted/20">
        <div className="text-sm text-muted-foreground">Loading schedule insights...</div>
      </div>
    );
  }

  // Filter schedule entries for this quote
  const quoteJobs = scheduleData.filter(entry => entry.quote_id === quoteId);
  
  // Filter schedule for matched machines (regardless of quote)
  // Match more flexibly: "VF2SS" matches "Haas VF-2 SS #1", "UMC750" matches "Haas UMC-750 Gen 1"
  const relatedMachineJobs = scheduleData.filter(entry => {
    const schedName = entry.machine_name.toLowerCase().replace(/[-\s]/g, '');
    return matchedMachineNames.some(name => {
      const matchName = name.toLowerCase().replace(/[-\s#0-9]/g, '');
      // Check if either name contains the other (fuzzy match)
      return schedName.includes(matchName.substring(0, 6)) || matchName.includes(schedName.substring(0, 6));
    });
  });

  console.log('🔍 Filtered data:', { quoteId, quoteJobs: quoteJobs.length, relatedMachineJobs: relatedMachineJobs.length, matchedMachineNames });

  if (quoteJobs.length === 0 && relatedMachineJobs.length === 0) {
    console.log('⚠️ No schedule data found for this quote or machines');
    // Show component anyway with a message for demo purposes
    return (
      <div className="mt-4 p-4 border border-dashed border-blue-300/50 rounded bg-blue-50/30 dark:bg-blue-950/20 dark:border-blue-700/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            🔧 Prototype: Machine Schedule Insights
          </div>
          <Badge variant="outline" className="text-xs">Feature Flag</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          No schedule data for Quote #{quoteId}. Sample data contains quotes 1-10.
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'complete': return 'default';
      case 'in_progress': return 'secondary';
      case 'scheduled': return 'outline';
      case 'delayed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return '✓';
      case 'in_progress': return '⟳';
      case 'scheduled': return '○';
      case 'delayed': return '⚠';
      default: return '○';
    }
  };

  return (
    <div className="mt-4 p-4 border border-dashed border-blue-300/50 rounded bg-blue-50/30 dark:bg-blue-950/20 dark:border-blue-700/30">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide">
          🔧 Prototype: Machine Schedule Insights
        </div>
        <Badge variant="outline" className="text-xs">Feature Flag</Badge>
      </div>

      {/* Jobs for this quote */}
      {quoteJobs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Jobs Scheduled for This Quote</h4>
          <div className="space-y-2">
            {quoteJobs.map((job, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm p-2 bg-white dark:bg-gray-900 rounded border border-border/50">
                <div className="flex-shrink-0 w-20">
                  <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                    {getStatusIcon(job.status)} {job.status}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{job.machine_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.job_name} · {job.operation} · {job.estimated_hours}h
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(job.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Machine availability context */}
      {relatedMachineJobs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">
            Matched Machine Activity ({relatedMachineJobs.length} jobs)
          </h4>
          <div className="text-xs text-muted-foreground mb-2">
            Recent and upcoming jobs on machines that can handle this quote
          </div>
          <div className="grid grid-cols-2 gap-2">
            {relatedMachineJobs.slice(0, 6).map((job, idx) => (
              <div key={idx} className="text-xs p-2 bg-white dark:bg-gray-900 rounded border border-border/30">
                <div className="font-medium">{job.machine_name}</div>
                <div className="text-muted-foreground truncate">{job.job_name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant={getStatusBadgeVariant(job.status)} className="text-xs">
                    {job.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(job.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {relatedMachineJobs.length > 6 && (
            <div className="text-xs text-muted-foreground mt-2 text-center">
              + {relatedMachineJobs.length - 6} more jobs
            </div>
          )}
        </div>
      )}
    </div>
  );
}
