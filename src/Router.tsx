import { useState, useEffect } from 'react';
import ManufacturingIntakeForm from './App';
import SubmissionHistory from './SubmissionHistory';
import UserManagement from './UserManagement';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';

function Router() {
  // Browser history mode routing
  const [path, setPath] = useState(window.location.pathname);
  const { user, hasPermission } = useAuth();

  // Migrate old hash URLs to history mode on initial load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      const newPath = hash.slice(1); // Remove the #
      window.history.replaceState({}, '', newPath);
      setPath(newPath);
    }
  }, []);

  // Listen for browser history changes
  useEffect(() => {
    const handlePopState = () => {
      console.log('[Router] popstate event, pathname:', window.location.pathname);
      setPath(window.location.pathname);
    };
    
    const handleNavigate = () => {
      console.log('[Router] navigate event, pathname:', window.location.pathname);
      setPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('navigate', handleNavigate);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  // Redirect to home if trying to access protected routes without permission
  useEffect(() => {
    if (path === '/history' && !hasPermission('canViewHistory')) {
      window.history.pushState({}, '', '/');
      setPath('/');
    }
    if (path === '/users' && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
      window.history.pushState({}, '', '/');
      setPath('/');
    }
  }, [path, user, hasPermission]);

  const renderPage = () => {
    console.log('[Router] rendering page for path:', path);
    if (path === '/history') return <SubmissionHistory />;
    if (path === '/users') return <UserManagement />;
    return <ManufacturingIntakeForm />;
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default Router;
