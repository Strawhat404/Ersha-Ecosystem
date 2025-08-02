import React, { useState, useEffect } from 'react';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import AdminNews from './pages/AdminNews';
import AdminLogistics from './pages/logistics/AdminLogistics';
import AdminFarmers from './pages/farmers/AdminFarmers';
import AdminMerchants from './pages/merchants/AdminMerchants';
import AdminExperts from './pages/experts/AdminExperts';
import Login from './pages/Login';

const getPage = (hash) => {
  switch (hash) {
    case '#news':
      return <AdminNews />;
    case '#logistics':
      return <AdminLogistics />;
    case '#farmers':
      return <AdminFarmers />;
    case '#merchants':
      return <AdminMerchants />;
    case '#experts':
      return <AdminExperts />;
    case '#dashboard':
    default:
      return <Dashboard />;
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState(window.location.hash || '#dashboard');

  useEffect(() => {
    const onHashChange = () => setPage(window.location.hash || '#dashboard');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => {
      setIsLoggedIn(true);
      window.location.hash = '#dashboard';
    }} />;
  }

  return (
    <AdminLayout>
      {getPage(page)}
    </AdminLayout>
  );
};

export default App;