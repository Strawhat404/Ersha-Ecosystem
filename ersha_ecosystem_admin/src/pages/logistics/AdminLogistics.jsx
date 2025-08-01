import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

const mockProviders = [
  {
    id: 1,
    name: 'FastFreight Ethiopia',
    email: 'fastfreight@email.com',
    phone: '+251 911 123456',
    status: 'pending',
    deliveries: 2450,
    rating: 4.8,
    logo: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverage: ['Addis Ababa', 'Oromia', 'Amhara', 'SNNPR'],
  },
  {
    id: 2,
    name: 'EthioLogistics',
    email: 'ethio@email.com',
    phone: '+251 922 654321',
    status: 'verified',
    deliveries: 3200,
    rating: 4.6,
    logo: 'https://randomuser.me/api/portraits/men/45.jpg',
    coverage: ['Addis Ababa', 'Dire Dawa', 'Hawassa'],
  },
  {
    id: 3,
    name: 'RapidTransport',
    email: 'rapid@email.com',
    phone: '+251 933 789012',
    status: 'pending',
    deliveries: 1890,
    rating: 4.4,
    logo: 'https://randomuser.me/api/portraits/men/65.jpg',
    coverage: ['Rural Areas', 'Remote Locations'],
  },
];

const AdminLogistics = () => {
  const [providers, setProviders] = useState(mockProviders);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const handleVerify = (id) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'verified' } : p))
    );
  };

  const handleReject = (id) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
  };

  // Filter providers by search
  const filteredProviders = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[95vw] 2xl:max-w-[1600px] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Service Providers</h1>
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 bg-white text-base"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow bg-white">
        <table className="min-w-full text-base">
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '240px' }} />
            <col style={{ width: '300px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '130px' }} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Logo</th>
              <th className="px-4 py-4 text-left font-semibold">Name</th>
              <th className="px-4 py-4 text-left font-semibold">Email</th>
              <th className="px-4 py-4 text-left font-semibold">Phone</th>
              <th className="px-4 py-4 text-left font-semibold">Coverage Areas</th>
              <th className="px-4 py-4 text-center font-semibold">Deliveries</th>
              <th className="px-4 py-4 text-center font-semibold">Rating</th>
              <th className="px-4 py-4 text-center font-semibold">Status</th>
              <th className="px-4 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400 text-lg">No providers found.</td>
              </tr>
            ) : (
              filteredProviders.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <img src={p.logo} alt={p.name} className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm aspect-square" />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-4 text-gray-700">{p.email}</td>
                  <td className="px-4 py-4 text-gray-700">{p.phone}</td>
                  <td className="px-4 py-4 min-w-[180px] max-w-[250px]">
                    <div className="flex flex-wrap gap-1">
                      {p.coverage.map((area, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{p.deliveries.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">{p.rating}</td>
                  <td className="px-4 py-4 text-center">
                    {p.status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                        <MdCheckCircle className="text-green-500" /> Verified
                      </span>
                    )}
                    {p.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        Pending
                      </span>
                    )}
                    {p.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                        <MdCancel className="text-red-500" /> Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      aria-label="Actions"
                    >
                      <BsThreeDotsVertical className="text-xl" />
                    </button>
                    {openMenu === p.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
                        <button
                          onClick={() => { handleVerify(p.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-green-50 text-green-700 font-medium rounded-t-lg"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => { handleReject(p.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-red-50 text-red-700 font-medium rounded-b-lg"
                        >
                          Reject
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

export default AdminLogistics;
