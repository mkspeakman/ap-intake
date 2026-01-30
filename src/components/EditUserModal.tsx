import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/types/user.types';

interface User {
  id: number;
  email: string;
  name: string;
  company_name?: string;
  phone?: string;
  role: UserRole;
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
  userRole: UserRole | null;
  currentUserEmail: string;
}

export function EditUserModal({ open, onClose, onSuccess, user, userRole, currentUserEmail }: EditUserModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('estimator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Track initial values for change detection
  const [initialValues, setInitialValues] = useState({
    email: '',
    name: '',
    companyName: '',
    phone: '',
    role: 'estimator' as UserRole,
  });

  // Initialize form when user changes
  useEffect(() => {
    if (user) {
      const initial = {
        email: user.email,
        name: user.name,
        companyName: user.company_name || '',
        phone: user.phone || '',
        role: user.role,
      };
      setInitialValues(initial);
      setEmail(initial.email);
      setName(initial.name);
      setCompanyName(initial.companyName);
      setPhone(initial.phone);
      setRole(initial.role);
      setHasChanges(false);
      setError('');
    }
  }, [user, open]);

  // Detect changes
  useEffect(() => {
    const changed = 
      email !== initialValues.email ||
      name !== initialValues.name ||
      companyName !== initialValues.companyName ||
      phone !== initialValues.phone ||
      role !== initialValues.role;
    setHasChanges(changed);
  }, [email, name, companyName, phone, role, initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hasChanges) return;
    
    setError('');
    setIsLoading(true);

    try {
      const token = btoa(currentUserEmail);
      
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email,
          name,
          company_name: companyName,
          phone,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update user');
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setName('');
    setCompanyName('');
    setPhone('');
    setRole('estimator');
    setError('');
    setHasChanges(false);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-thin">Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" key={user.id}>
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-company">Company Name</Label>
            <Input
              id="edit-company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              key={`role-${user.id}-${role}`}
            >
              <SelectTrigger id="edit-role">
                <SelectValue>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="estimator">Estimator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                {userRole === 'superadmin' && (
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const subject = encodeURIComponent('Your AP-AI Account Information');
                const body = encodeURIComponent(
                  `Hi ${name},\n\n` +
                  `Here is your Autopilot Quote Request login information:\n\n` +
                  `====================\n` +
                  `LOGIN INFORMATION\n` +
                  `====================\n` +
                  `Email: ${email}\n` +
                  `Role: ${role.charAt(0).toUpperCase() + role.slice(1)}\n` +
                  `====================\n\n` +
                  `If you need to reset your password, please email matt@autopilotdesign.com.\n\n` +
                  `Best regards`
                );
                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
              }}
              disabled={!email || !name}
              className="text-muted-foreground"
            >
              Send Email
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !hasChanges}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
