import { useState, useEffect } from 'react';
import ManufacturingIntakeForm from './App';
import SubmissionHistory from './SubmissionHistory';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';

function Router() {
  // Simple hash-based routing for now
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');
  const { user } = useAuth();

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setPath(window.location.hash.slice(1) || '/');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect to home if trying to access history without permission
  useEffect(() => {
    if (path === '/history' && (!user || !user.permissions.canViewHistory)) {
      window.location.hash = '/';
    }
  }, [path, user]);

  return (
    <Layout>
      {path === '/history' ? <SubmissionHistory /> : <ManufacturingIntakeForm />}
    </Layout>
  );
}

export default Router;
