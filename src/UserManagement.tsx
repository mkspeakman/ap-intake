// User Management Page - Admin & Superadmin only
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddUserModal } from '@/components/AddUserModal';
import { EditUserModal } from '@/components/EditUserModal';
import { UserPlus, Pencil, Settings } from 'lucide-react';
import type { UserRole } from '@/types/user.types';

interface User {
  id: number;
  email: string;
  name: string;
  company_name?: string;
  phone?: string;
  role: UserRole;
  can_view_history: boolean;
  last_login: string | null;
  created_at: string;
}

export default function UserManagement() {
  const { user: currentUser, userRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showTestUsers, setShowTestUsers] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create auth token (simple base64 for now)
      const token = btoa(currentUser!.email);
      
      const url = showTestUsers ? '/api/admin/users?includeTestUsers=true' : '/api/admin/users';
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatRole = (role: UserRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  };

  useEffect(() => {
    fetchUsers();
  }, [showTestUsers]);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsOpen]);

  // Check if user has permission to be here
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-gray-600">Loading users...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-card">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-thin">User Management</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage user accounts and permissions
            </p>
          </div>
          
          {(userRole === 'superadmin' || userRole === 'admin') && (
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowAddUser(true)}
                variant="outline" 
                size="sm" 
                className="rounded-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
              
              {userRole === 'superadmin' && (
                <div className="relative" ref={settingsRef}>
                  <Button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    variant="outline"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  {settingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50">
                      <button
                        onClick={() => {
                          setShowTestUsers(!showTestUsers);
                          setSettingsOpen(false);
                        }}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {showTestUsers ? '✓ ' : ''}Show Test Users
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}
      </div>

      {/* Table Section - Scrollable */}
      <div className="flex-1 overflow-auto">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-muted-foreground uppercase tracking-wide">
                    Created
                  </th>
                  {(userRole === 'admin' || userRole === 'superadmin') && (
                    <th className="px-6 py-4 text-right text-xs font-normal text-muted-foreground uppercase tracking-wide w-20">
                      
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {user.company_name || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`mailto:${user.email}`} 
                        className="text-sm text-muted-foreground hover:text-foreground underline"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {user.phone || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{formatRole(user.role)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">{formatDate(user.last_login)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground">{formatDate(user.created_at)}</div>
                    </td>
                    {(userRole === 'admin' || userRole === 'superadmin') && (
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSuccess={() => {
          setShowAddUser(false);
          fetchUsers();
        }}
        userRole={userRole}
        currentUserEmail={currentUser?.email || ''}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => {
          setEditingUser(null);
          fetchUsers();
        }}
        user={editingUser}
        userRole={userRole}
        currentUserEmail={currentUser?.email || ''}
      />
    </div>
  );
}
