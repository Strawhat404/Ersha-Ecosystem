import React from 'react';
import { MdArticle, MdLocalShipping, MdAgriculture, MdStorefront } from 'react-icons/md';
        <a
          href="#merchants"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <MdStorefront className="text-2xl text-green-700" />
          Merchants
        </a>

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-green-900 text-white flex flex-col shadow-lg z-50">
      <div className="h-16 flex items-center justify-center font-bold text-lg tracking-wide border-b border-green-800 select-none">
        Ersha-Ecosystem
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-4 bg-white">
        <a
          href="#dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <svg className="text-2xl text-green-700" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>
          Dashboard
        </a>
        <a
          href="#news"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <MdArticle className="text-2xl text-green-700" />
          News
        </a>
        <a
          href="#logistics"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <MdLocalShipping className="text-2xl text-green-700" />
          Logistics
        </a>
        <a
          href="#farmers"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <MdAgriculture className="text-2xl text-green-700" />
          Farmers
        </a>
        <a
          href="#merchants"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <MdStorefront className="text-2xl text-green-700" />
          Merchants
        </a>
        <a
          href="#experts"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-green-900 font-medium bg-white hover:bg-green-50 transition shadow-sm"
        >
          <span className="text-2xl text-green-700"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 7v-7m0 0l-9-5m9 5l9-5" /></svg></span>
          Experts
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
