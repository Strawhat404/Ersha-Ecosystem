import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search,
  Filter,
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
  Video,
  User,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';

const ExpertBookedUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API calls
  const [bookedUsers, setBookedUsers] = useState([
    {
      id: 1,
      name: 'Abebe Kebede',
      email: 'abebe.kebede@email.com',
      phone: '+251-911-123-456',
      location: 'Addis Ababa, Ethiopia',
      avatar: 'AK',
      totalConsultations: 8,
      completedConsultations: 6,
      rating: 4.8,
      lastConsultation: '2024-01-28',
      nextConsultation: '2024-02-05',
      status: 'active',
      consultationHistory: [
        { date: '2024-01-28', topic: 'Tomato Disease Management', status: 'completed', rating: 5 },
        { date: '2024-01-15', topic: 'Soil Testing Results', status: 'completed', rating: 4 },
        { date: '2024-01-02', topic: 'Crop Rotation Planning', status: 'completed', rating: 5 }
      ],
      specializations: ['Vegetable Farming', 'Organic Methods'],
      joinedDate: '2023-08-15',
      farmSize: '2.5 hectares'
    },
    {
      id: 2,
      name: 'Meron Tadesse',
      email: 'meron.tadesse@email.com',
      phone: '+251-922-234-567',
      location: 'Oromia, Ethiopia',
      avatar: 'MT',
      totalConsultations: 12,
      completedConsultations: 10,
      rating: 4.9,
      lastConsultation: '2024-01-30',
      nextConsultation: '2024-02-08',
      status: 'active',
      consultationHistory: [
        { date: '2024-01-30', topic: 'Organic Farming Techniques', status: 'completed', rating: 5 },
        { date: '2024-01-20', topic: 'Pest Control Methods', status: 'completed', rating: 5 },
        { date: '2024-01-10', topic: 'Irrigation System Setup', status: 'completed', rating: 4 }
      ],
      specializations: ['Organic Farming', 'Irrigation'],
      joinedDate: '2023-06-20',
      farmSize: '5.0 hectares'
    },
    {
      id: 3,
      name: 'Dawit Solomon',
      email: 'dawit.solomon@email.com',
      phone: '+251-933-345-678',
      location: 'Amhara, Ethiopia',
      avatar: 'DS',
      totalConsultations: 5,
      completedConsultations: 4,
      rating: 4.6,
      lastConsultation: '2024-01-25',
      nextConsultation: null,
      status: 'inactive',
      consultationHistory: [
        { date: '2024-01-25', topic: 'Irrigation System Setup', status: 'completed', rating: 5 },
        { date: '2024-01-12', topic: 'Crop Selection Advice', status: 'completed', rating: 4 },
        { date: '2023-12-28', topic: 'Soil Health Assessment', status: 'completed', rating: 5 }
      ],
      specializations: ['Irrigation', 'Crop Management'],
      joinedDate: '2023-10-10',
      farmSize: '3.2 hectares'
    },
    {
      id: 4,
      name: 'Tigist Bekele',
      email: 'tigist.bekele@email.com',
      phone: '+251-944-456-789',
      location: 'SNNPR, Ethiopia',
      avatar: 'TB',
      totalConsultations: 15,
      completedConsultations: 14,
      rating: 4.7,
      lastConsultation: '2024-02-01',
      nextConsultation: '2024-02-10',
      status: 'active',
      consultationHistory: [
        { date: '2024-02-01', topic: 'Coffee Disease Management', status: 'completed', rating: 5 },
        { date: '2024-01-22', topic: 'Harvest Timing Optimization', status: 'completed', rating: 4 },
        { date: '2024-01-08', topic: 'Fertilizer Application', status: 'completed', rating: 5 }
      ],
      specializations: ['Coffee Farming', 'Disease Management'],
      joinedDate: '2023-04-12',
      farmSize: '1.8 hectares'
    },
    {
      id: 5,
      name: 'Yohannes Girma',
      email: 'yohannes.girma@email.com',
      phone: '+251-955-567-890',
      location: 'Tigray, Ethiopia',
      avatar: 'YG',
      totalConsultations: 3,
      completedConsultations: 2,
      rating: 4.5,
      lastConsultation: '2024-01-18',
      nextConsultation: '2024-02-12',
      status: 'pending',
      consultationHistory: [
        { date: '2024-01-18', topic: 'Drought Management', status: 'completed', rating: 4 },
        { date: '2024-01-05', topic: 'Water Conservation', status: 'completed', rating: 5 },
        { date: '2023-12-20', topic: 'Initial Consultation', status: 'cancelled', rating: null }
      ],
      specializations: ['Water Management', 'Drought Resistance'],
      joinedDate: '2023-12-15',
      farmSize: '4.1 hectares'
    }
  ]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booked Users</h1>
          <p className="text-gray-600 mt-1">All clients who have booked consultations with you</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setLoading(true)}
            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

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
                {(bookedUsers.reduce((sum, user) => sum + user.rating, 0) / bookedUsers.length).toFixed(1)}
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
    </div>
  );
};

export default ExpertBookedUsers;
