import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Video,
  Phone,
  MapPin,
  Plus,
  Settings,
  ExternalLink,
  Bell,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download
} from 'lucide-react';

const ExpertCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Mock calendar events - replace with actual API calls
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Tomato Disease Management',
      client: 'Abebe Kebede',
      clientAvatar: 'AK',
      date: '2024-02-05',
      time: '10:00 AM',
      duration: 60,
      type: 'video',
      status: 'confirmed',
      description: 'Consultation about tomato plant diseases and treatment methods',
      notes: 'Client has photos of affected plants to share',
      price: 150
    },
    {
      id: 2,
      title: 'Organic Farming Techniques',
      client: 'Meron Tadesse',
      clientAvatar: 'MT',
      date: '2024-02-05',
      time: '2:30 PM',
      duration: 45,
      type: 'phone',
      status: 'confirmed',
      description: 'Discussion about transitioning to organic farming methods',
      notes: 'Follow-up consultation',
      price: 120
    },
    {
      id: 3,
      title: 'Irrigation System Setup',
      client: 'Dawit Solomon',
      clientAvatar: 'DS',
      date: '2024-02-06',
      time: '9:00 AM',
      duration: 90,
      type: 'video',
      status: 'pending',
      description: 'Planning and setup guidance for drip irrigation system',
      notes: 'Client needs technical specifications',
      price: 200
    },
    {
      id: 4,
      title: 'Coffee Disease Management',
      client: 'Tigist Bekele',
      clientAvatar: 'TB',
      date: '2024-02-07',
      time: '11:00 AM',
      duration: 60,
      type: 'video',
      status: 'confirmed',
      description: 'Coffee plant disease identification and treatment',
      notes: 'Urgent consultation - disease spreading',
      price: 180
    },
    {
      id: 5,
      title: 'Soil Health Assessment',
      client: 'Yohannes Girma',
      clientAvatar: 'YG',
      date: '2024-02-08',
      time: '3:00 PM',
      duration: 75,
      type: 'phone',
      status: 'cancelled',
      description: 'Analysis of soil test results and recommendations',
      notes: 'Client requested reschedule',
      price: 160
    }
  ]);

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
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  {event.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span>Join Call</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
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
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Connect with Calendly</h4>
              <p className="text-gray-600 mb-4">
                Integrate your Calendly account to automatically sync your availability and bookings.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
                <ExternalLink className="w-4 h-4" />
                <span>Connect Calendly</span>
              </button>
            </div>
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
    </div>
  );
};

export default ExpertCalendar;
