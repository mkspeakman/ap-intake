import ManufacturingIntakeForm from './App';
import SubmissionHistory from './SubmissionHistory';
import Layout from './components/Layout';

function Router() {
  // Simple hash-based routing for now
  const path = window.location.hash.slice(1) || '/';

  return (
    <Layout>
      {path === '/history' ? <SubmissionHistory /> : <ManufacturingIntakeForm />}
    </Layout>
  );
}

export default Router;
