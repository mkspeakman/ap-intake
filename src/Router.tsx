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

  // Listen for browser history changes
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
