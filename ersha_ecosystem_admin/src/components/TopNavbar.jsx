import React from 'react';

const TopNavbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow flex items-center px-6 z-50">
      <div className="font-bold text-xl text-gray-900">Ersha Admin</div>
      <div className="ml-auto flex items-center gap-4">
        <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Profile</button>
        <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Logout</button>
      </div>
    </header>
  );
};

export default TopNavbar;
