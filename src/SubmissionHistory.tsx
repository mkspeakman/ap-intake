import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar,
  Building2,
  Package,
  Clock,
  ChevronDown,
  FileText
} from 'lucide-react';

// Mock data for visualization
const mockSubmissions = [
  {
    id: 1,
    quote_number: 'QR-20260107-0842',
    company_name: 'Acme Manufacturing',
    contact_name: 'John Smith',
    email: 'john@acme.com',
    project_name: 'Custom Brackets',
    materials: ['Aluminum', 'Steel'],
    finishes: ['Anodized', 'Powder Coat'],
    quantity: '500',
    status: 'pending',
    created_at: '2026-01-07T08:42:15Z',
    drive_link: 'https://drive.google.com/...',
    certifications: ['ISO 9001'],
  },
  {
    id: 2,
    quote_number: 'QR-20260106-1523',
    company_name: 'TechCorp Industries',
    contact_name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    project_name: 'Precision Housing Components',
    materials: ['Titanium', 'Aluminum'],
    finishes: ['Anodized'],
    quantity: '1000',
    status: 'in-progress',
    created_at: '2026-01-06T15:23:45Z',
    drive_link: 'https://drive.google.com/...',
    certifications: ['ISO 9001', 'ITAR'],
  },
  {
    id: 3,
    quote_number: 'QR-20260106-0915',
    company_name: 'Precision Parts Co',
    contact_name: 'Mike Williams',
    email: 'mike@precisionparts.com',
    project_name: 'Medical Device Components',
    materials: ['Stainless Steel'],
    finishes: ['Electropolish'],
    quantity: '250',
    status: 'quoted',
    created_at: '2026-01-06T09:15:30Z',
    drive_link: null,
    certifications: ['ISO 13485', 'ISO 9001'],
  },
  {
    id: 4,
    quote_number: 'QR-20260105-1634',
    company_name: 'Aerospace Dynamics',
    contact_name: 'Lisa Chen',
    email: 'lisa@aerodynamics.com',
    project_name: 'Aircraft Mounting Hardware',
    materials: ['Titanium', 'Inconel'],
    finishes: ['Passivation'],
    quantity: '100',
    status: 'completed',
    created_at: '2026-01-05T16:34:12Z',
    drive_link: 'https://drive.google.com/...',
    certifications: ['AS9100', 'ITAR'],
  },
];

const statusColors = {
  pending: 'secondary',
  'in-progress': 'warning',
  quoted: 'default',
  completed: 'success',
} as const;

export default function SubmissionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

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

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
                <div className="text-2xl font-bold">4</div>
                <div className="text-xs text-muted-foreground">Total Requests</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">1</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">2</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">1</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Quote Number</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[180px]">Submitted</TableHead>
                  <TableHead className="w-[80px]">Files</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((submission) => (
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
                            <div className="font-medium">{submission.company_name}</div>
                            <div className="text-xs text-muted-foreground">{submission.contact_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {submission.project_name}
                        </div>
                      </TableCell>
                      <TableCell>{submission.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[submission.status as keyof typeof statusColors]}>
                          {getStatusLabel(submission.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
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
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                                  <div><span className="text-muted-foreground">Email:</span> {submission.email}</div>
                                  <div><span className="text-muted-foreground">Contact:</span> {submission.contact_name}</div>
                                </div>
                              </div>

                              {/* Materials & Finishes */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Specifications</h4>
                                <div className="text-sm space-y-2">
                                  <div>
                                    <span className="text-muted-foreground">Materials:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {submission.materials.map((material, i) => (
                                        <Badge key={i} variant="outline">{material}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Finishes:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {submission.finishes.map((finish, i) => (
                                        <Badge key={i} variant="outline">{finish}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {submission.certifications.length > 0 && (
                                    <div>
                                      <span className="text-muted-foreground">Certifications:</span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {submission.certifications.map((cert, i) => (
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
          </div>

          {/* Pagination Placeholder */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Showing 4 of 4 results
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
