import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/types/user.types';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userRole: UserRole | null;
  currentUserEmail: string;
}

export function AddUserModal({ open, onClose, onSuccess, userRole, currentUserEmail }: AddUserModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('estimator');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = btoa(currentUserEmail);
      
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, companyName, phone, role, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      // Success - reset form and close
      handleClose();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
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
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Contact Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="First and Last Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="ABC Corp, Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="address@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(___)___-____"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estimator">Estimator</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                {userRole === 'superadmin' && <SelectItem value="superadmin">Superadmin</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const subject = encodeURIComponent('Your AP-AI Account Login');
                const body = encodeURIComponent(
                  `Hi ${name || '[Name]'},\n\n` +
                  `You've been invited to join AP-AI. Here are your login credentials:\n\n` +
                  `====================\n` +
                  `LOGIN INFORMATION\n` +
                  `====================\n` +
                  `Email: ${email}\n` +
                  `Password: ${password}\n` +
                  `====================\n\n` +
                  `Please log in at your earliest convenience and change your password.\n\n` +
                  `Best regards`
                );
                window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
              }}
              disabled={!email || !password || !name}
              className="text-muted-foreground"
            >
              Send Invitation
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
