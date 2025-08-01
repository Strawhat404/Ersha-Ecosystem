import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdCheckCircle, MdFlag, MdBlock } from 'react-icons/md';

const mockMerchants = [
  {
    id: 1,
    firstName: 'Alemu',
    lastName: 'Bekele',
    username: 'alemub',
    email: 'alemubekele@gmail.com',
    phone: '+251911223344',
    region: 'Addis Ababa',
    dateJoined: '7/30/2025',
    status: 'pending',
    avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
  },
  {
    id: 2,
    firstName: 'Sara',
    lastName: 'Tadesse',
    username: 'sarat',
    email: 'sara.tadesse@gmail.com',
    phone: '+251922334455',
    region: 'Oromia',
    dateJoined: '7/28/2025',
    status: 'verified',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    id: 3,
    firstName: 'Kebede',
    lastName: 'Mulu',
    username: 'kebedem',
    email: 'kebede.mulu@gmail.com',
    phone: '+251933445566',
    region: 'Amhara',
    dateJoined: '7/25/2025',
    status: 'flagged',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
  },
];

const AdminMerchants = () => {
  const [merchants, setMerchants] = useState(mockMerchants);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const handleVerify = (id) => {
    setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'verified' } : m)));
  };
  const handleFlag = (id) => {
    setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'flagged' } : m)));
  };
  const handleBan = (id) => {
    setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'banned' } : m)));
  };

  const filteredMerchants = merchants.filter(
    (m) =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[95vw] 2xl:max-w-[1600px] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Merchants</h1>
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search merchants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 bg-white text-base"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow bg-white">
        <table className="min-w-full text-base">
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '130px' }} />
          </colgroup>
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left font-semibold">Avatar</th>
              <th className="px-4 py-4 text-left font-semibold">First Name</th>
              <th className="px-4 py-4 text-left font-semibold">Last Name</th>
              <th className="px-4 py-4 text-left font-semibold">Username</th>
              <th className="px-4 py-4 text-left font-semibold">Email</th>
              <th className="px-4 py-4 text-left font-semibold">Phone</th>
              <th className="px-4 py-4 text-left font-semibold">Region</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Date Joined</th>
              <th className="px-4 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMerchants.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400 text-lg">No merchants found.</td>
              </tr>
            ) : (
              filteredMerchants.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <img src={m.avatar} alt={m.firstName} className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm aspect-square" />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{m.firstName}</td>
                  <td className="px-4 py-4 font-medium text-gray-900">{m.lastName}</td>
                  <td className="px-4 py-4 text-gray-700">{m.username}</td>
                  <td className="px-4 py-4 text-gray-700">{m.email}</td>
                  <td className="px-4 py-4 text-gray-700">{m.phone}</td>
                  <td className="px-4 py-4 text-gray-700">{m.region}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${m.status === 'verified' ? 'bg-green-100 text-green-700' : ''}
                      ${m.status === 'banned' ? 'bg-red-100 text-red-700' : ''}
                      ${m.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{m.dateJoined}</td>
                  <td className="px-4 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                      aria-label="Actions"
                    >
                      <BsThreeDotsVertical className="text-xl" />
                    </button>
                    {openMenu === m.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
                        <button
                          onClick={() => { handleVerify(m.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-green-50 text-green-700 font-medium rounded-t-lg"
                        >
                          <span className="inline-flex items-center gap-2"><MdCheckCircle className="text-lg" />Verify</span>
                        </button>
                        <button
                          onClick={() => { handleFlag(m.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-yellow-50 text-yellow-700 font-medium"
                        >
                          <span className="inline-flex items-center gap-2"><MdFlag className="text-lg" />Flag</span>
                        </button>
                        <button
                          onClick={() => { handleBan(m.id); setOpenMenu(null); }}
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

export default AdminMerchants;
