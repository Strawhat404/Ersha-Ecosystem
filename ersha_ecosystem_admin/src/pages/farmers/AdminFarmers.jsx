import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdCheckCircle, MdFlag, MdBlock } from 'react-icons/md';
import { usersAPI } from '../../lib/api';

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getUsers({ user_type: 'farmer' });
      setFarmers(data.results || data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      setError('Failed to load farmers data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await usersAPI.verifyUser(id);
      setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, verification_status: 'verified' } : f)));
    } catch (error) {
      console.error('Error verifying farmer:', error);
      alert('Failed to verify farmer');
    }
  };

  const handleFlag = async (id) => {
    try {
      await usersAPI.flagUser(id);
      setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, verification_status: 'failed' } : f)));
    } catch (error) {
      console.error('Error flagging farmer:', error);
      alert('Failed to flag farmer');
    }
  };

  const handleBan = async (id) => {
    try {
      await usersAPI.banUser(id);
      setFarmers((prev) => prev.map((f) => (f.id === id ? { ...f, is_active: false } : f)));
    } catch (error) {
      console.error('Error banning farmer:', error);
      alert('Failed to ban farmer');
    }
  };

  const filteredFarmers = farmers.filter(
    (f) =>
      f.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      f.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      f.username?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.phone?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-[95vw] 2xl:max-w-[1600px] mx-auto py-10 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farmers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[95vw] 2xl:max-w-[1600px] mx-auto py-10 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchFarmers}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              <th className="px-4 py-4 text-left font-semibold">Email</th>
              <th className="px-4 py-4 text-left font-semibold">Phone</th>
              <th className="px-4 py-4 text-left font-semibold">Region</th>
              <th className="px-4 py-4 text-left font-semibold">Farm Size</th>
              <th className="px-4 py-4 text-left font-semibold">Status</th>
              <th className="px-4 py-4 text-left font-semibold">Date Joined</th>
              <th className="px-4 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFarmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <img
                    src={farmer.profile?.profile_picture || `https://randomuser.me/api/portraits/men/${farmer.id % 20 + 1}.jpg`}
                    alt={`${farmer.first_name} ${farmer.last_name}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-4 font-medium">{farmer.first_name || 'N/A'}</td>
                <td className="px-4 py-4">{farmer.last_name || 'N/A'}</td>
                <td className="px-4 py-4">{farmer.email}</td>
                <td className="px-4 py-4">{farmer.phone || 'N/A'}</td>
                <td className="px-4 py-4">{farmer.region || 'N/A'}</td>
                <td className="px-4 py-4">
                  {farmer.profile?.farm_size ? `${farmer.profile.farm_size} ${farmer.profile.farm_size_unit || 'hectares'}` : 'N/A'}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    farmer.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                    farmer.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    farmer.verification_status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {farmer.verification_status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(farmer.date_joined).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === farmer.id ? null : farmer.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {openMenu === farmer.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <div className="py-1">
                        {farmer.verification_status !== 'verified' && (
                          <button
                            onClick={() => {
                              handleVerify(farmer.id);
                              setOpenMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <MdCheckCircle className="mr-2 text-green-600" />
                            Verify
                          </button>
                        )}
                        {farmer.verification_status !== 'failed' && (
                          <button
                            onClick={() => {
                              handleFlag(farmer.id);
                              setOpenMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <MdFlag className="mr-2 text-yellow-600" />
                            Flag
                          </button>
                        )}
                        {farmer.is_active && (
                          <button
                            onClick={() => {
                              handleBan(farmer.id);
                              setOpenMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <MdBlock className="mr-2 text-red-600" />
                            Ban
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFarmers;
