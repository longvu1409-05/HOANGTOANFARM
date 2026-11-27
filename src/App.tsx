import { useEffect, useState } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { HomePage } from './pages/HomePage';

function checkIsAdminUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get('admin') === '1' || window.location.hash === '#admin';
}

export function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdminUrl);

  useEffect(() => {
    const syncRoute = () => setIsAdmin(checkIsAdminUrl());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  return isAdmin ? <AdminDashboard /> : <HomePage />;
}

export default App;
