import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdCheckCircle, MdFlag, MdBlock } from 'react-icons/md';

const mockFarmers = [
  {
    id: 1,
    firstName: 'Abel',
    lastName: 'Kiya',
    username: 'kiya',
    email: 'abelyitahes10@gmail.com',
    phone: '+251985401417',
    region: 'Addis Ababa',
    farmSize: 2.5,
    dateJoined: '7/30/2025',
    status: 'pending',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    id: 2,
    firstName: 'Henok',
    lastName: '',
    username: 'henok',
    email: 'khinlove22@gmail.com',
    phone: '+251940339675',
    region: 'Oromia',
    farmSize: 3.1,
    dateJoined: '7/26/2025',
    status: 'verified',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: 3,
    firstName: 'Bubu',
    lastName: 'baba',
    username: 'bubu',
    email: 'bubu@gmail.com',
    phone: '+251922334455',
    region: 'Amhara',
    farmSize: 1.8,
    dateJoined: '7/23/2025',
    status: 'banned',
    avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
  },
];

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState(mockFarmers);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const handleVerify = (id) => {
    setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'verified' } : f)));
  };
  const handleFlag = (id) => {
    setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'flagged' } : f)));
  };
  const handleBan = (id) => {
    setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'banned' } : f)));
  };

  const filteredFarmers = farmers.filter(
    (f) =>
      f.firstName.toLowerCase().includes(search.toLowerCase()) ||
      f.lastName.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[95vw] 2xl:max-w-[1600px] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Farmers</h1>
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search farmers..."
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
              <th className="px-4 py-4 text-left font-semibold">Farm Size</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Date Joined</th>
              <th className="px-4 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-gray-400 text-lg">No farmers found.</td>
              </tr>
            ) : (
              filteredFarmers.map((f) => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div className="w-14 h-14 flex items-center justify-center">
                      <img src={f.avatar} alt={f.firstName} className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm aspect-square" />
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">{f.firstName}</td>
                  <td className="px-4 py-4 font-medium text-gray-900">{f.lastName}</td>
                  <td className="px-4 py-4 text-gray-700">{f.username}</td>
                  <td className="px-4 py-4 text-gray-700">{f.email}</td>
                  <td className="px-4 py-4 text-gray-700">{f.phone}</td>
                  <td className="px-4 py-4 text-gray-700">{f.region}</td>
                  <td className="px-4 py-4 text-gray-700">{f.farmSize}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${f.status === 'verified' ? 'bg-green-100 text-green-700' : ''}
                      ${f.status === 'banned' ? 'bg-red-100 text-red-700' : ''}
                      ${f.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{f.dateJoined}</td>
                  <td className="px-4 py-4 text-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                      onClick={() => setOpenMenu(openMenu === f.id ? null : f.id)}
                      aria-label="Actions"
                    >
                      <BsThreeDotsVertical className="text-xl" />
                    </button>
                    {openMenu === f.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-col">
                        <button
                          onClick={() => { handleVerify(f.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-green-50 text-green-700 font-medium rounded-t-lg"
                        >
                          <span className="inline-flex items-center gap-2"><MdCheckCircle className="text-lg" />Verify</span>
                        </button>
                        <button
                          onClick={() => { handleFlag(f.id); setOpenMenu(null); }}
                          className="px-4 py-2 text-left hover:bg-yellow-50 text-yellow-700 font-medium"
                        >
                          <span className="inline-flex items-center gap-2"><MdFlag className="text-lg" />Flag</span>
                        </button>
                        <button
                          onClick={() => { handleBan(f.id); setOpenMenu(null); }}
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

export default AdminFarmers;
