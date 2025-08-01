import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdCheckCircle, MdFlag, MdBlock } from 'react-icons/md';

const mockExperts = [
  {
    id: 1,
    name: 'Dr. Amanuel Tadesse',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    phone: '+251 911 123456',
    email: 'amanuel.tadesse@example.com',
    professionalFields: 'Agronomy, Soil Science',
    certificate: 'PhD in Agronomy',
    status: 'verified',
  },
  {
    id: 2,
    name: 'Ms. Selamawit Getachew',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    phone: '+251 922 654321',
    email: 'selamawit.getachew@example.com',
    professionalFields: 'Plant Pathology',
    certificate: 'MSc in Plant Pathology',
    status: 'flagged',
  },
  {
    id: 3,
    name: 'Mr. Dawit Mekonnen',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    phone: '+251 933 789012',
    email: 'dawit.mekonnen@example.com',
    professionalFields: 'Irrigation, Water Management',
    certificate: 'BSc in Water Engineering',
    status: 'banned',
  },
];

const AdminExperts = () => {
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [experts, setExperts] = useState(mockExperts);

  const filteredExperts = experts.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.toLowerCase().includes(search.toLowerCase()) ||
      e.professionalFields.toLowerCase().includes(search.toLowerCase())
  );

  // Placeholder action handlers
  const handleVerify = (id) => {
    setExperts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'verified' } : e))
    );
  };
  const handleFlag = (id) => {
    setExperts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'flagged' } : e))
    );
  };
  const handleBan = (id) => {
    setExperts((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'banned' } : e))
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-900">Experts</h1>
        <input
          type="text"
          placeholder="Search experts..."
          className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '130px' }} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Avatar</th>
              <th className="px-4 py-4 text-left font-semibold">Name</th>
              <th className="px-4 py-4 text-left font-semibold">Phone</th>
              <th className="px-4 py-4 text-left font-semibold">Email</th>
              <th className="px-4 py-4 text-left font-semibold">Professional Fields</th>
              <th className="px-4 py-4 text-left font-semibold">Certificate</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExperts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400 text-lg">No experts found.</td>
              </tr>
            ) : (
              filteredExperts.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <img src={e.avatar} alt={e.name} className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm aspect-square" />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{e.name}</td>
                  <td className="px-4 py-4 text-gray-700">{e.phone}</td>
                  <td className="px-4 py-4 text-gray-700">{e.email}</td>
                  <td className="px-4 py-4 text-gray-700">{e.professionalFields}</td>
                  <td className="px-4 py-4 text-gray-700">{e.certificate}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${e.status === 'verified' ? 'bg-green-100 text-green-700' : ''}
                      ${e.status === 'banned' ? 'bg-red-100 text-red-700' : ''}
                      ${e.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => setOpenMenu(openMenu === e.id ? null : e.id)}
                      aria-label="Actions"
                    >
                      <BsThreeDotsVertical className="text-xl" />
                    </button>
                    {openMenu === e.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
                        <button
                          onClick={() => { handleVerify(e.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-green-50 text-green-700 font-medium rounded-t-lg"
                        >
                          <span className="inline-flex items-center gap-2"><MdCheckCircle className="text-lg" />Verify</span>
                        </button>
                        <button
                          onClick={() => { handleFlag(e.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-yellow-50 text-yellow-700 font-medium"
                        >
                          <span className="inline-flex items-center gap-2"><MdFlag className="text-lg" />Flag</span>
                        </button>
                        <button
                          onClick={() => { handleBan(e.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-red-50 text-red-700 font-medium rounded-b-lg"
                        >
                          <span className="inline-flex items-center gap-2"><MdBlock className="text-lg" />Ban</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminExperts;
