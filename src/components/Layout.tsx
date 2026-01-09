import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/LoginModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigateTo('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - 48px tall */}
      <header className="flex-shrink-0 bg-[#0A0A0B] z-50 h-12">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigateTo('/')} className="flex items-center">
            <img 
              src="/ap-ai-on-black.svg" 
              alt="AP-AI Logo" 
              className="h-6"
            />
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Only show navigation items if authenticated */}
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateTo('/')}
                  disabled={currentPath === '/'}
                  className={`h-8 ${
                    currentPath === '/' 
                      ? 'text-white bg-white/10 cursor-default' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  New Request
                </Button>
                
                {user?.permissions.canViewHistory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateTo('/history')}
                    disabled={currentPath === '/history'}
                    className={`h-8 ${
                      currentPath === '/history' 
                        ? 'text-white bg-white/10 cursor-default' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    History
                  </Button>
                )}
              </>
            )}

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUserClick}
                className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/5"
              >
                <User className="h-4 w-4" />
              </Button>

              {isAuthenticated && (
                <DropdownMenu open={dropdownOpen}>
                  <div className="px-2 py-1.5 text-sm font-medium border-b">
                    {user?.name}
                  </div>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
