import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ExpertProfileSetup from './ExpertProfileSetup';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Plus,
  Settings,
  ExternalLink,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Download,
  Link,
  X,
  Phone,
} from 'lucide-react';
import { useState, useEffect } from 'react';
const ExpertCalendar = () => {
  const { user, profile } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);
  
  // Calendly connection modal
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState('');
  const [connectingCalendly, setConnectingCalendly] = useState(false);

  // Profile setup
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Fetch expert profile
  const fetchExpertProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        // Expert profile doesn't exist yet
        setExpertProfile(null);
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
    } finally {
      setLoading(false);
    }
  };

  // Handle profile creation
  const handleProfileCreated = (profileData) => {
    setExpertProfile(profileData);
    setShowProfileSetup(false);
    // Refresh consultations after profile creation
    fetchConsultations();
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

  // Connect Calendly
  const handleConnectCalendly = async () => {
    if (!calendlyLink.trim()) {
      alert('Please enter your Calendly link');
      return;
    }

    try {
      setConnectingCalendly(true);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/experts/${expertProfile.id}/connect_calendly/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendly_link: calendlyLink
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect Calendly');
      }

      const data = await response.json();
      alert(data.message);
      
      // Refresh expert profile
      await fetchExpertProfile();
      setShowCalendlyModal(false);
      setCalendlyLink('');
      
    } catch (err) {
      alert(err.message || 'Failed to connect Calendly. Please try again.');
    } finally {
      setConnectingCalendly(false);
    }
  };

  // Update consultation status
  const updateConsultationStatus = async (consultationId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/consultations/${consultationId}/update_consultation_status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update consultation status');
      }

      // Refresh consultations
      await fetchConsultations();
      
    } catch (err) {
      alert(err.message || 'Failed to update consultation status. Please try again.');
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchExpertProfile();
      fetchConsultations();
    }
  }, [user]);

  // Convert consultations to calendar events format
  const events = consultations.map(consultation => ({
    id: consultation.id,
    title: consultation.subject,
    client: consultation.user_name,
    clientAvatar: consultation.user_name.split(' ').map(n => n[0]).join('').toUpperCase(),
    date: consultation.preferred_date,
    time: consultation.preferred_time,
    duration: Math.round(consultation.duration_hours * 60),
    type: 'video', // Default to video for now
    status: consultation.status,
    description: consultation.description,
    notes: consultation.expert_notes,
    price: consultation.total_cost,
    consultation: consultation // Keep the full consultation object
  }));

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Day headers
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
          {day}
        </div>
      );
    });

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border-b border-gray-100"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateEvents = getEventsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = formatDate(date) === formatDate(selectedDate);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-2 min-h-[80px] border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
            isSelected ? 'bg-green-50 border-green-200' : ''
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-green-600' : 'text-gray-900'
          }`}>
            {day}
            {isToday && <div className="w-2 h-2 bg-green-600 rounded-full mx-auto mt-1"></div>}
          </div>
          <div className="space-y-1">
            {dateEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
                className={`text-xs p-1 rounded truncate cursor-pointer ${
                  event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {event.time} - {event.client}
              </div>
            ))}
            {dateEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dateEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const EventModal = ({ event, onClose }) => (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Consultation Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                  {event.clientAvatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.client}</p>
                  <p className="text-sm text-gray-600">{event.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{event.time} ({event.duration} min)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {event.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span className="capitalize">{event.type} call</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-green-600 font-medium">${event.price}</span>
                </div>
              </div>

              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(event.status)}`}>
                {getStatusIcon(event.status)}
                <span className="text-sm font-medium capitalize">{event.status}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>

              {event.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                  <p className="text-sm text-gray-600">{event.notes}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => {
                    if (event.consultation) {
                      updateConsultationStatus(event.consultation.id, 'confirmed');
                    }
                  }}
                  disabled={event.status === 'confirmed' || event.status === 'completed'}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {event.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span>{event.status === 'confirmed' ? 'Confirmed' : 'Confirm'}</span>
                </button>
                {event.status === 'confirmed' && (
                  <button 
                    onClick={() => {
                      if (event.consultation) {
                        updateConsultationStatus(event.consultation.id, 'completed');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {event.status === 'pending' && (
                  <button 
                    onClick={() => {
                      if (event.consultation) {
                        updateConsultationStatus(event.consultation.id, 'cancelled');
                      }
                    }}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    return event.status === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Show profile setup if no expert profile exists */}
      {showProfileSetup && (
        <ExpertProfileSetup
          onProfileCreated={handleProfileCreated}
          onCancel={() => setShowProfileSetup(false)}
        />
      )}

      {/* Show calendar only if expert profile exists */}
      {!showProfileSetup && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600 mt-1">Manage your consultation schedule and appointments</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'confirmed').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'pending').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter(e => {
                      const eventDate = new Date(e.date);
                      const now = new Date();
                      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      return eventDate >= weekStart && eventDate <= weekEnd;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Today
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {renderCalendarGrid()}
                </div>
              </div>

              {/* Calendly Integration Placeholder */}
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Calendly Integration</h3>
                    <p className="text-sm text-gray-600">Manage your availability and booking settings</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
                
                {loading ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : expertProfile?.calendly_connected ? (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Calendly Connected</h4>
                    <p className="text-gray-600 mb-4">
                      Your Calendly account is connected and ready to receive bookings.
                    </p>
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => window.open(expertProfile.calendly_link, '_blank')}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Calendly</span>
                      </button>
                      <button 
                        onClick={() => setShowCalendlyModal(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Update Link</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                    <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Connect with Calendly</h4>
                    <p className="text-gray-600 mb-4">
                      Integrate your Calendly account to automatically sync your availability and bookings.
                    </p>
                    <button 
                      onClick={() => setShowCalendlyModal(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Link className="w-4 h-4" />
                      <span>Connect Calendly</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {filteredEvents.slice(0, 5).map(event => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {event.clientAvatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.client}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">{event.date} at {event.time}</span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Schedule Consultation</span>
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Set Availability</span>
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event Modal */}
          <EventModal 
            event={selectedEvent} 
            onClose={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
            }} 
          />

          {/* Calendly Connection Modal */}
          <AnimatePresence>
            {showCalendlyModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowCalendlyModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Link className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Connect Calendly</h2>
                          <p className="text-gray-600">Link your Calendly account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCalendlyModal(false)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calendly Link *
                        </label>
                        <input
                          type="url"
                          value={calendlyLink}
                          onChange={(e) => setCalendlyLink(e.target.value)}
                          placeholder="https://calendly.com/your-username/consultation"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your Calendly booking link. Users will be redirected here to book consultations.
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">How to get your Calendly link:</span>
                        </div>
                        <ol className="text-xs text-blue-700 space-y-1">
                          <li>1. Go to <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="underline">calendly.com</a></li>
                          <li>2. Create an account or sign in</li>
                          <li>3. Create a new event type for consultations</li>
                          <li>4. Copy the booking link and paste it above</li>
                        </ol>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => setShowCalendlyModal(false)}
                          disabled={connectingCalendly}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConnectCalendly}
                          disabled={connectingCalendly || !calendlyLink.trim()}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {connectingCalendly ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <Link className="w-4 h-4" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ExpertCalendar;
