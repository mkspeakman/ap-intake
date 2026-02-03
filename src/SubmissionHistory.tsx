import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent, PopoverOverlay } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getMachineSpritePosition, hasMachineSprite } from '@/lib/machine-sprite';
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
import { useAuth } from '@/contexts/AuthContext';
import type { MachineMatch, CapabilityAnalysis } from '@/types/database.types';

interface Submission {
  id: number;
  quote_number: string;
  status: string;
  company_name: string | null;
  contact_name: string | null;
  email: string | null;
  project_name: string;
  materials: string[];
  finishes: string[];
  quantity: string;
  created_at: string;
  drive_link: string | null;
  drive_file_id: string | null;
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
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedSubmissionDetails, setSelectedSubmissionDetails] = useState<Submission | null>(null);
  const [reanalyzing, setReanalyzing] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmissionDetails(submission);
    setDetailsDialogOpen(true);
  };

  const handleReanalyze = async (submission: Submission) => {
    setReanalyzing(submission.id);
    try {
      await fetch('/api/analyze-capability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: submission.id,
          materials: submission.materials,
          quantity: submission.quantity,
          certifications: submission.certifications,
          description: submission.description,
        }),
      });
      // Refresh submissions to show updated analysis
      await fetchSubmissions();
    } catch (err) {
      console.error('Error re-analyzing:', err);
    } finally {
      setReanalyzing(null);
    }
  };

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
                    <TableHead className="w-[250px]">Submitted</TableHead>
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

                                {/* Risk Flags */}
                                {submission.capability_analysis.risk_flags && 
                                 submission.capability_analysis.risk_flags.length > 0 && (
                                  <div className="space-y-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded">
                                    <div className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      Risk Factors
                                    </div>
                                    <ul className="text-sm space-y-1">
                                      {submission.capability_analysis.risk_flags.map((flag: string, i: number) => (
                                        <li key={i} className="text-amber-800 dark:text-amber-200">
                                          {flag}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Material Difficulty */}
                                {submission.capability_analysis.material_difficulty && 
                                 submission.capability_analysis.material_difficulty.classification && 
                                 submission.capability_analysis.material_difficulty.classification !== 'Standard' && (
                                  <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
                                    <div className="text-xs font-medium text-blue-800 dark:text-blue-200 uppercase tracking-wider">
                                      Material Difficulty: {submission.capability_analysis.material_difficulty.classification}
                                    </div>
                                    {submission.capability_analysis.material_difficulty.concerns && submission.capability_analysis.material_difficulty.concerns.length > 0 && (
                                      <ul className="text-sm space-y-1">
                                        {submission.capability_analysis.material_difficulty.concerns.map((concern: string, i: number) => (
                                          <li key={i} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                            {concern}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                )}

                                {/* Cost & Lead Time Estimates */}
                                {submission.review_status !== 'insufficient_data' && 
                                 (submission.capability_analysis.cost_estimate || submission.capability_analysis.lead_time_estimate) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Cost Estimate */}
                                    {submission.capability_analysis.cost_estimate && 
                                     submission.capability_analysis.cost_estimate.total_cost > 0 && (
                                      <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded">
                                        <div className="text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                                          Cost Estimate
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Material:</span>
                                            <span className="font-medium">${(submission.capability_analysis.cost_estimate.material_cost ?? 0).toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Machining:</span>
                                            <span className="font-medium">${(submission.capability_analysis.cost_estimate.machining_cost ?? 0).toFixed(2)}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Setup:</span>
                                            <span className="font-medium">${(submission.capability_analysis.cost_estimate.setup_cost ?? 0).toFixed(2)}</span>
                                          </div>
                                          {submission.capability_analysis.cost_estimate.outsourcing_cost && submission.capability_analysis.cost_estimate.outsourcing_cost > 0 && (
                                            <div className="flex justify-between text-sm">
                                              <span className="text-muted-foreground">Outsourcing:</span>
                                              <span className="font-medium">${submission.capability_analysis.cost_estimate.outsourcing_cost.toFixed(2)}</span>
                                            </div>
                                          )}
                                          <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="font-medium">Per Part:</span>
                                            <span className="font-bold text-green-700 dark:text-green-300">
                                              ${(submission.capability_analysis.cost_estimate.per_unit_cost ?? 0).toFixed(2)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="font-medium">Total Cost:</span>
                                            <span className="font-bold text-lg text-green-700 dark:text-green-300">
                                              ${(submission.capability_analysis.cost_estimate.total_cost ?? 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </span>
                                          </div>
                                          {submission.capability_analysis.cost_estimate.confidence_level && (
                                            <div className="text-xs text-muted-foreground italic mt-1">
                                              Confidence: {submission.capability_analysis.cost_estimate.confidence_level}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Lead Time Estimate */}
                                    {submission.capability_analysis.lead_time_estimate && 
                                     submission.capability_analysis.lead_time_estimate.total_days > 0 && (
                                      <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded">
                                        <div className="text-xs font-medium text-purple-800 dark:text-purple-200 uppercase tracking-wider">
                                          Lead Time Estimate
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Setup:</span>
                                            <span className="font-medium">{submission.capability_analysis.lead_time_estimate.setup_days ?? 0} days</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Production:</span>
                                            <span className="font-medium">{submission.capability_analysis.lead_time_estimate.production_days ?? 0} days</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Queue:</span>
                                            <span className="font-medium">{submission.capability_analysis.lead_time_estimate.queue_days ?? 0} days</span>
                                          </div>
                                          <div className="flex justify-between text-sm pt-2 border-t">
                                            <span className="font-medium">Total Lead Time:</span>
                                            <span className="font-bold text-lg text-purple-700 dark:text-purple-300">
                                              {submission.capability_analysis.lead_time_estimate.total_days ?? 0} days
                                            </span>
                                          </div>
                                          {submission.capability_analysis.lead_time_estimate.expedite_possible && submission.capability_analysis.lead_time_estimate.expedite_days && (
                                            <div className="text-xs text-green-600 dark:text-green-400 italic mt-1">
                                              ⚡ Expedite available: {submission.capability_analysis.lead_time_estimate.expedite_days} days
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Operations List */}
                                {submission.capability_analysis.operations_list && 
                                 submission.capability_analysis.operations_list.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                      Operations Matched
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {submission.capability_analysis.operations_list.map((op: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-green-100 dark:bg-green-900">
                                          ✓ {op}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

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
                                 submission.machine_matches.length > 0 && (() => {
                                   const highConfidence = submission.machine_matches.filter(m => m.match_score >= 70);
                                   const mediumLowConfidence = submission.machine_matches.filter(m => m.match_score < 70);
                                   
                                   return (
                                     <div className="space-y-3">
                                       <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                         Matched Equipment ({submission.machine_matches.length})
                                       </div>
                                       
                                       {/* High Confidence Machines - Card Display */}
                                       {highConfidence.length > 0 && (
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                           {highConfidence.map((match, i) => {
                                             const spritePosition = getMachineSpritePosition(match.machine_id);
                                             const hasSprite = hasMachineSprite(match.machine_id);
                                             
                                             return (
                                               <div 
                                                 key={i}
                                                 className="flex items-start gap-3 p-3 bg-muted/50 rounded border border-border/50 hover:border-border transition-colors"
                                               >
                                                 {/* Machine Image from Sprite */}
                                                 {hasSprite && spritePosition && (
                                                   <div 
                                                     className="flex-shrink-0 w-32 h-32 rounded border border-border bg-white"
                                                     style={{
                                                       backgroundImage: 'url(/equipment/machines-sprite.jpg)',
                                                       backgroundSize: '600% 200%',
                                                       backgroundPosition: spritePosition,
                                                       backgroundRepeat: 'no-repeat'
                                                     }}
                                                   />
                                                 )}
                                                 
                                                 {/* Machine Info */}
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
                                                 
                                                 {/* Confidence Score */}
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
                                             );
                                           })}
                                         </div>
                                       )}
                                       
                                       {/* Medium/Low Confidence Machines - Minimal List */}
                                       {mediumLowConfidence.length > 0 && (
                                         <div className="space-y-1.5 pt-2 border-t border-border/50">
                                           <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                             Additional Capable Machines
                                           </div>
                                           <div className="space-y-0.5">
                                             {mediumLowConfidence.map((match, i) => (
                                               <div 
                                                 key={i}
                                                 className="flex items-center justify-between py-1 px-2 hover:bg-muted/30 rounded text-xs"
                                               >
                                                 <span className="text-muted-foreground">{match.name}</span>
                                                 <span className="text-muted-foreground/60 font-mono">
                                                   {Math.round(match.match_score)}%
                                                 </span>
                                               </div>
                                             ))}
                                           </div>
                                         </div>
                                       )}
                                     </div>
                                   );
                                 })()}

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
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(submission);
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReanalyze(submission);
                                  }}
                                  disabled={reanalyzing === submission.id}
                                >
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  {reanalyzing === submission.id ? 'Analyzing...' : 'Re-analyze'}
                                </Button>
                              )}
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

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-light text-2xl">Quote Request Details</DialogTitle>
          </DialogHeader>
          {selectedSubmissionDetails && (
            <div className="space-y-6 font-sans">
              {/* Quote Number */}
              <div className="border-b pb-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Quote Number</div>
                <div className="font-mono text-sm">{selectedSubmissionDetails.quote_number}</div>
              </div>

              {/* Company & Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Company</div>
                  <div className="text-sm">{selectedSubmissionDetails.company_name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Contact Name</div>
                  <div className="text-sm">{selectedSubmissionDetails.contact_name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Email</div>
                  <div className="text-sm">{selectedSubmissionDetails.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Phone</div>
                  <div className="text-sm">{selectedSubmissionDetails.phone || 'N/A'}</div>
                </div>
              </div>

              {/* Project Information */}
              <div className="border-t pt-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Project Name</div>
                <div className="text-sm font-medium mb-3">{selectedSubmissionDetails.project_name}</div>
                {selectedSubmissionDetails.description && (
                  <>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Description</div>
                    <div className="text-sm leading-relaxed">{selectedSubmissionDetails.description}</div>
                  </>
                )}
              </div>

              {/* Materials & Finishes */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Materials</div>
                  <div className="flex flex-wrap gap-1">
                    {(selectedSubmissionDetails.materials || []).map((material, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded">{material}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Finishes</div>
                  <div className="flex flex-wrap gap-1">
                    {(selectedSubmissionDetails.finishes || []).map((finish, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded">{finish}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity & Timeline */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Quantity</div>
                  <div className="text-sm">{selectedSubmissionDetails.quantity}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Lead Time</div>
                  <div className="text-sm">{selectedSubmissionDetails.lead_time || 'N/A'}</div>
                </div>
              </div>

              {/* Part Notes */}
              {selectedSubmissionDetails.part_notes && (
                <div className="border-t pt-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Part Notes</div>
                  <div className="text-sm leading-relaxed">{selectedSubmissionDetails.part_notes}</div>
                </div>
              )}

              {/* Certifications */}
              {selectedSubmissionDetails.certifications && selectedSubmissionDetails.certifications.length > 0 && (
                <div className="border-t pt-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Certifications</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSubmissionDetails.certifications.map((cert, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded">{cert}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Date */}
              <div className="border-t pt-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Submitted</div>
                <div className="text-sm">{formatDate(selectedSubmissionDetails.created_at)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
