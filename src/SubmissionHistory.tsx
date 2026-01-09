import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Building2,
  ChevronDown,
  FileText
} from 'lucide-react';

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
}

export default function SubmissionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions. Please try again.');
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
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-4 md:p-8">
      <Card className="w-full max-w-7xl">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quote Request History</h1>
              <p className="text-sm text-muted-foreground mt-2">
                View and manage all submitted manufacturing quotes
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
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

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{submissions.length}</div>
                <div className="text-xs text-muted-foreground">Total Requests</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{submissions.filter(s => s.drive_link).length}</div>
                <div className="text-xs text-muted-foreground">Processed</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{submissions.filter(s => !s.drive_link).length}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{submissions.filter(s => s.certifications?.length > 0).length}</div>
                <div className="text-xs text-muted-foreground">With Certifications</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading submissions...
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchSubmissions} size="sm">
                  Retry
                </Button>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No submissions found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[150px]">Quote Number</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[185px]">Submitted</TableHead>
                    <TableHead className="w-[80px]">Files</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                  <>
                    <TableRow 
                      key={submission.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedSubmission(
                        selectedSubmission === submission.id ? null : submission.id
                      )}
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        {submission.quote_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{submission.company_name || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">{submission.contact_name || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.project_name}
                      </TableCell>
                      <TableCell>{submission.quantity}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(submission.created_at)}
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
                          <div className="py-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Contact Info */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Contact Information</h4>
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
                                <h4 className="text-sm font-semibold">Specifications</h4>
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
                  </>
                ))}
              </TableBody>
            </Table>
            )}
          </div>

          {/* Pagination Placeholder */}
          <div className="flex items-center justify-between pt-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
