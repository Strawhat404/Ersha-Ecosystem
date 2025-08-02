import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ExpertProfileSetup from './ExpertProfileSetup';
import { 
  Users, 
  Search,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';

const ExpertBookedUsers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Real data from API
  const [consultations, setConsultations] = useState([]);

  // Profile setup state
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [expertProfile, setExpertProfile] = useState(null);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Handle profile creation
  const handleProfileCreated = (profileData) => {
    setExpertProfile(profileData);
    setShowProfileSetup(false);
    // Refresh consultations after profile creation
    fetchConsultations();
  };

  // Fetch expert profile
  const fetchExpertProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/experts/my_profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Expert profile doesn't exist - show profile setup
        setShowProfileSetup(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpertProfile(data);
      setShowProfileSetup(false);
    } catch (err) {
      setError('Failed to load expert profile. Please try again.');
      console.error('Error fetching expert profile:', err);
    }
  };

  // Fetch consultations
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/experts/my_consultations/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConsultations(data);
    } catch (err) {
      setError('Failed to load consultations. Please try again.');
      console.error('Error fetching consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchExpertProfile();
      fetchConsultations();
    }
  }, [user]);

  // Process consultations into user data
  const processUserData = () => {
    const userMap = new Map();
    
    consultations.forEach(consultation => {
      const userEmail = consultation.user_email;
      
      if (!userMap.has(userEmail)) {
        userMap.set(userEmail, {
          id: userEmail,
          name: consultation.user_name,
          email: consultation.user_email,
          phone: '+251-XXX-XXX-XXX', // Placeholder since we don't have phone in consultation data
          location: 'Ethiopia', // Placeholder since we don't have location in consultation data
          avatar: consultation.user_name.split(' ').map(n => n[0]).join('').toUpperCase(),
          totalConsultations: 0,
          completedConsultations: 0,
          rating: 4.5, // Placeholder rating
          lastConsultation: null,
          nextConsultation: null,
          status: 'active',
          consultationHistory: [],
          specializations: ['Agriculture'], // Placeholder
          joinedDate: consultation.created_at,
          farmSize: 'N/A' // Placeholder
        });
      }
      
      const user = userMap.get(userEmail);
      user.totalConsultations++;
      
      if (consultation.status === 'completed') {
        user.completedConsultations++;
      }
      
      // Add to consultation history
      user.consultationHistory.push({
        date: consultation.preferred_date,
        topic: consultation.subject,
        status: consultation.status,
        rating: consultation.status === 'completed' ? 5 : null // Placeholder rating
      });
      
      // Update last and next consultation dates
      const consultationDate = new Date(consultation.preferred_date);
      if (!user.lastConsultation || consultationDate > new Date(user.lastConsultation)) {
        user.lastConsultation = consultation.preferred_date;
      }
      
      if (consultation.status === 'confirmed' && consultationDate > new Date()) {
        if (!user.nextConsultation || consultationDate < new Date(user.nextConsultation)) {
          user.nextConsultation = consultation.preferred_date;
        }
      }
    });
    
    return Array.from(userMap.values());
  };

  const bookedUsers = processUserData();

  const calculateAverageRating = (users) => {
    if (!users || users.length === 0) {
      return '0.0';
    }
    
    const validRatings = users
      .map(user => user.rating)
      .filter(rating => rating !== null && rating !== undefined && !isNaN(rating));
    
    if (validRatings.length === 0) {
      return '0.0';
    }
    
    const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
    return average.toFixed(1);
  };

  const filteredUsers = bookedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'consultations':
        return b.totalConsultations - a.totalConsultations;
      case 'recent':
      default:
        return new Date(b.lastConsultation) - new Date(a.lastConsultation);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const UserCard = ({ user }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                {getStatusIcon(user.status)}
                <span className="capitalize">{user.status}</span>
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-yellow-500 mb-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-gray-900">{user.rating}</span>
          </div>
          <button
            onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{user.totalConsultations}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{user.completedConsultations}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{user.totalConsultations - user.completedConsultations}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last: {new Date(user.lastConsultation).toLocaleDateString()}</span>
          </div>
          {user.nextConsultation && (
            <div className="flex items-center space-x-2 text-green-600">
              <Calendar className="w-4 h-4" />
              <span>Next: {new Date(user.nextConsultation).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {selectedUser === user.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-100"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Farm Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Farm Size:</span>
                    <span className="ml-2 font-medium">{user.farmSize}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Joined:</span>
                    <span className="ml-2 font-medium">{new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {user.specializations.map((spec, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Consultations</h4>
                <div className="space-y-2">
                  {user.consultationHistory.slice(0, 3).map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{consultation.topic}</p>
                        <p className="text-xs text-gray-500">{new Date(consultation.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {consultation.status === 'completed' && consultation.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">{consultation.rating}</span>
                          </div>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Show profile setup if no expert profile exists */}
      {showProfileSetup && (
        <ExpertProfileSetup
          onProfileCreated={handleProfileCreated}
          onCancel={() => setShowProfileSetup(false)}
        />
      )}

      {/* Show booked users only if expert profile exists */}
      {!showProfileSetup && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booked Users</h1>
              <p className="text-gray-600 mt-1">All clients who have booked consultations with you</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={fetchConsultations}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading booked users...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchConsultations();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{bookedUsers.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{bookedUsers.filter(u => u.status === 'active').length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {calculateAverageRating(bookedUsers)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {bookedUsers.reduce((sum, user) => sum + user.totalConsultations, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search users by name, email, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="name">Name A-Z</option>
                      <option value="rating">Highest Rating</option>
                      <option value="consultations">Most Consultations</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>

              {sortedUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ExpertBookedUsers;
