import { useState, useEffect } from 'react';
import ManufacturingIntakeForm from './App';
import SubmissionHistory from './SubmissionHistory';
import UserManagement from './UserManagement';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';

function Router() {
  // Simple hash-based routing for now
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');
  const { user, hasPermission } = useAuth();

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash.slice(1) || '/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect to home if trying to access protected routes without permission
  useEffect(() => {
    if (path === '/history' && !hasPermission('canViewHistory')) {
      window.location.hash = '/';
    }
    if (path === '/users' && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
      window.location.hash = '/';
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
