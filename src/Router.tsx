import ManufacturingIntakeForm from './App';
import SubmissionHistory from './SubmissionHistory';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';

function Router() {
  // Simple hash-based routing for now
  const path = window.location.hash.slice(1) || '/';
  const { user } = useAuth();

  // Redirect to home if trying to access history without permission
  if (path === '/history' && (!user || !user.permissions.canViewHistory)) {
    window.location.hash = '/';
    return null;
  }

  return (
    <Layout>
      {path === '/history' ? <SubmissionHistory /> : <ManufacturingIntakeForm />}
    </Layout>
  );
}

export default Router;
