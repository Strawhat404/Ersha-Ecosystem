import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <Sidebar />
      <main className="pt-16 pl-0 md:pl-56 pb-0 md:pb-0 transition-all">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
