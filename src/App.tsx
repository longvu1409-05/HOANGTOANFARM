import { AdminDashboard } from './components/admin/AdminDashboard';
import { HomePage } from './pages/HomePage';

export function App() {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get('admin') === '1' || window.location.hash === '#admin';

  return isAdmin ? <AdminDashboard /> : <HomePage />;
}

export default App;
