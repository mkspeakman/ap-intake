import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LoginModal } from '@/components/LoginModal';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated, hasPermission } = useAuth();
  const { resolvedTheme } = useTheme();
  
  // Listen for browser history changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const navigateTo = (path: string) => {
    console.log('[Layout] navigating to:', path);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    // Dispatch custom event to notify Router
    window.dispatchEvent(new Event('navigate'));
    console.log('[Layout] dispatched navigate event');
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

  const handleFeedbackClick = () => {
    setDropdownOpen(false);
    setFeedbackOpen(true);
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
      <header className={`flex-shrink-0 z-50 h-12 transition-colors ${
        resolvedTheme === 'light' ? 'bg-[#FCB716]' : 'bg-[#0A0A0B]'
      }`}>
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigateTo('/')} className="flex items-center">
            <img 
              src={resolvedTheme === 'light' ? '/ap-ai_on-gold.svg' : '/ap-ai_on-black.svg'} 
              alt="AP-AI Logo" 
              className="h-6 w-auto"
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
                      ? (resolvedTheme === 'light' ? 'bg-[#0A0A0B]/10 cursor-default' : 'bg-white/10 cursor-default')
                      : (resolvedTheme === 'light' ? 'hover:bg-[#0A0A0B]/10' : 'hover:bg-white/10')
                  } ${resolvedTheme === 'light' ? 'text-[#0A0A0B]' : 'text-white'}`}
                >
                  New Request
                </Button>
                
                {hasPermission('canViewHistory') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateTo('/history')}
                    disabled={currentPath === '/history'}
                    className={`h-8 ${
                      currentPath === '/history' 
                        ? (resolvedTheme === 'light' ? 'bg-[#0A0A0B]/10 cursor-default' : 'bg-white/10 cursor-default')
                        : (resolvedTheme === 'light' ? 'hover:bg-[#0A0A0B]/10' : 'hover:bg-white/10')
                    } ${resolvedTheme === 'light' ? 'text-[#0A0A0B]' : 'text-white'}`}
                  >
                    History
                  </Button>
                )}
                
                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateTo('/users')}
                    disabled={currentPath === '/users'}
                    className={`h-8 ${
                      currentPath === '/users' 
                        ? (resolvedTheme === 'light' ? 'bg-[#0A0A0B]/10 cursor-default' : 'bg-white/10 cursor-default')
                        : (resolvedTheme === 'light' ? 'hover:bg-[#0A0A0B]/10' : 'hover:bg-white/10')
                    } ${resolvedTheme === 'light' ? 'text-[#0A0A0B]' : 'text-white'}`}
                  >
                    Users
                  </Button>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUserClick}
                className={`h-8 w-8 p-0 ${
                  resolvedTheme === 'light' ? 'hover:bg-[#0A0A0B]/10 text-[#0A0A0B]' : 'hover:bg-white/10 text-white'
                }`}
              >
                <User className="h-4 w-4" />
              </Button>

              {isAuthenticated && (
                <DropdownMenu open={dropdownOpen}>
                  <div className="px-2 py-1.5 border-b">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                  <DropdownMenuItem onClick={handleFeedbackClick}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Feedback
                  </DropdownMenuItem>
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

      {/* Feedback Widget */}
      <FeedbackWidget open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
