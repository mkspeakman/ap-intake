import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent, PopoverOverlay } from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronDown,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Cpu,
  TrendingUp
} from 'lucide-react';
import type { MachineMatch, CapabilityAnalysis } from '@/types/database.types';

interface Submission {
  id: number;
  quote_number: string;
  company_name: string | null;
  contact_name: string | null;
  email: string | null;
  project_name: string;
  materials: string[];
  finishes: string[];
  quantity: string;
  created_at: string;
  drive_link: string | null;
  certifications: string[];
  description: string | null;
  phone: string | null;
  lead_time: string | null;
  part_notes: string | null;
  in_house_feasibility?: 'full' | 'partial' | 'none';
  machine_matches?: MachineMatch[];
  outsourced_steps?: string[];
  capability_analysis?: CapabilityAnalysis;
  review_status?: string;
}

export default function SubmissionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/quote-requests');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Not running on Vercel - API routes not available
        setError('Database not available. Run "vercel dev" for full functionality.');
        setSubmissions([]);
        return;
      }
      
      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Database not available. Run "vercel dev" for full functionality.');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-card">
      {/* Overlay when popover is open */}
      {filterOpen && <PopoverOverlay onClick={() => setFilterOpen(false)} />}
      
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-thin">Quote Request History</h1>
            <p className="text-sm text-muted-foreground mt-2">
              View and manage all submitted manufacturing quotes
            </p>
          </div>
          <div className="flex gap-2">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className='rounded-full'>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-120">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Filter Submissions</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Date Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="date" placeholder="From" className="text-sm" />
                        <Input type="date" placeholder="To" className="text-sm" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Company</label>
                      <Input placeholder="Filter by company..." className="h-8 text-sm" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Materials</label>
                      <Input placeholder="Filter by materials..." className="h-8 text-sm" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Status</label>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending Files</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setFilterOpen(false)}>
                      Reset
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => setFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, project, or quote number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 min-h-0 border rounded-lg overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Loading submissions...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchSubmissions} size="sm">
                Retry
              </Button>
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No submissions found
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[150px]">Quote Number</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="w-[210px]">Submitted</TableHead>
                    <TableHead className="w-[200px]">Submitted by</TableHead>
                    <TableHead className="w-[80px]">Files</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                  <React.Fragment key={submission.id}>
                    <TableRow 
                      className="cursor-pointer"
                      onClick={() => setSelectedSubmission(
                        selectedSubmission === submission.id ? null : submission.id
                      )}
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        {submission.quote_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.company_name || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{submission.contact_name || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.project_name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(submission.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{submission.contact_name || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{submission.email || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.drive_link ? (
                          <a
                            href={submission.drive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-primary hover:opacity-80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${
                            selectedSubmission === submission.id ? 'rotate-180' : ''
                          }`}
                        />
                      </TableCell>
                    </TableRow>
                    {/* Expanded Details Row */}
                    {selectedSubmission === submission.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/30">
                          <div className="py-4 space-y-6">
                            {/* Equipment Capability Analysis */}
                            {submission.capability_analysis && (
                              <div className="space-y-3 p-4 bg-card rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Cpu className="h-4 w-4" />
                                    Manufacturing Capability Analysis
                                  </h4>
                                  {submission.review_status === 'insufficient_data' ? (
                                    <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200">
                                      <AlertCircle className="h-3 w-3" />
                                      Insufficient Data
                                    </Badge>
                                  ) : submission.in_house_feasibility && (
                                    <Badge 
                                      variant={
                                        submission.in_house_feasibility === 'full' ? 'default' :
                                        submission.in_house_feasibility === 'partial' ? 'secondary' : 
                                        'destructive'
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      {submission.in_house_feasibility === 'full' && <CheckCircle2 className="h-3 w-3" />}
                                      {submission.in_house_feasibility === 'partial' && <AlertCircle className="h-3 w-3" />}
                                      {submission.in_house_feasibility === 'none' && <XCircle className="h-3 w-3" />}
                                      {submission.in_house_feasibility === 'full' ? 'Fully In-House' :
                                       submission.in_house_feasibility === 'partial' ? 'Partial In-House' :
                                       'Outsource Required'}
                                    </Badge>
                                  )}
                                </div>

                                {/* Summary */}
                                <p className="text-sm text-muted-foreground">
                                  {submission.capability_analysis.feasibility_summary}
                                </p>

                                {/* Validation Errors - Show for insufficient data */}
                                {submission.review_status === 'insufficient_data' && 
                                 submission.capability_analysis.validation_errors && 
                                 submission.capability_analysis.validation_errors.length > 0 && (
                                  <div className="space-y-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded">
                                    <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                                      Missing Information
                                    </div>
                                    <ul className="text-sm space-y-1">
                                      {submission.capability_analysis.validation_errors.map((error: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200">
                                          <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                                          {error}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Machine Matches - Only show if NOT insufficient data */}
                                {submission.review_status !== 'insufficient_data' && 
                                 submission.machine_matches && 
                                 submission.machine_matches.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                      Matched Equipment ({submission.machine_matches.length})
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {submission.machine_matches.slice(0, 4).map((match, i) => (
                                        <div 
                                          key={i}
                                          className="flex items-start justify-between p-3 bg-muted/50 rounded border border-border/50 hover:border-border transition-colors"
                                        >
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                              {match.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                              {match.matched_operations.join(', ')}
                                            </div>
                                            {match.notes && (
                                              <div className="text-xs text-muted-foreground mt-1">
                                                {match.notes}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex flex-col items-end ml-3 flex-shrink-0">
                                            <div className="flex items-center gap-1">
                                              <TrendingUp className="h-3 w-3 text-green-600" />
                                              <span className="text-xs font-semibold text-green-600">
                                                {Math.round(match.match_score)}%
                                              </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              confidence
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Outsourced Steps */}
                                {submission.outsourced_steps && submission.outsourced_steps.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                      Requires Outsourcing
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {submission.outsourced_steps.map((step, i) => (
                                        <Badge key={i} variant="outline" className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                                          {step}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Quick Stats - Only show if NOT insufficient data */}
                                {submission.review_status !== 'insufficient_data' && (
                                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-foreground">
                                        {submission.capability_analysis.operations_matched || 0}
                                        <span className="text-sm text-muted-foreground">
                                          /{submission.capability_analysis.total_operations_required || 0}
                                        </span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">Operations Matched</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-foreground">
                                        {submission.capability_analysis.confidence_score || 0}%
                                      </div>
                                      <div className="text-xs text-muted-foreground">Confidence Score</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-foreground">
                                        {submission.capability_analysis.estimated_setup_time_min || '—'}
                                        {submission.capability_analysis.estimated_setup_time_min && (
                                          <span className="text-sm text-muted-foreground">min</span>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">Est. Setup Time</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Contact Info */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Contact Information</h4>
                                <div className="text-sm space-y-1">
                                  <div><span className="text-muted-foreground">Email:</span> {submission.email || 'N/A'}</div>
                                  <div><span className="text-muted-foreground">Contact:</span> {submission.contact_name || 'N/A'}</div>
                                  {submission.phone && (
                                    <div><span className="text-muted-foreground">Phone:</span> {submission.phone}</div>
                                  )}
                                </div>
                              </div>

                              {/* Materials & Finishes */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Specifications</h4>
                                <div className="text-sm space-y-2">
                                  <div>
                                    <span className="text-muted-foreground">Materials:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {(submission.materials || []).map((material, i) => (
                                        <Badge key={i} variant="outline">{material}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Finishes:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {(submission.finishes || []).map((finish, i) => (
                                        <Badge key={i} variant="outline">{finish}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {(submission.certifications?.length > 0) && (
                                    <div>
                                      <span className="text-muted-foreground">Certifications:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {(submission.certifications || []).map((cert, i) => (
                                          <Badge key={i} variant="secondary">{cert}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              {submission.drive_link && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={submission.drive_link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open in Drive
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Footer Section - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          Showing {submissions.length} of {submissions.length} results
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
