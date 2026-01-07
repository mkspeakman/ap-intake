import ManufacturingIntakeForm from './App';
import SubmissionHistory from './SubmissionHistory';

function Router() {
  // Simple hash-based routing for now
  const path = window.location.hash.slice(1) || '/';

  if (path === '/history') {
    return <SubmissionHistory />;
  }

  return <ManufacturingIntakeForm />;
}

export default Router;
