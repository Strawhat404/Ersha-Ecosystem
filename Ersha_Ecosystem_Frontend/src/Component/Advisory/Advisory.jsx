import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sprout, BookOpen, Search, Filter, Star, MapPin, Clock, DollarSign, ExternalLink, Sparkles, Cloud, TrendingUp, GraduationCap, Target, Download } from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";
import CourseGenerationModal from "./CourseGenerationModal";

const Advisory = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("advice");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API data states
  const [experts, setExperts] = useState([]);
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [advisoryContent, setAdvisoryContent] = useState([]);
  
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Course Generation modal state
  const [showCourseModal, setShowCourseModal] = useState(false);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Download function for PDF files
  const handleDownload = (downloadUrl, filename) => {
    if (!downloadUrl) {
      alert('Download URL not available');
      return;
    }
    
    // Construct full backend URL
    const backendUrl = downloadUrl.startsWith('http') 
      ? downloadUrl 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${downloadUrl}`;
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = backendUrl;
    link.download = filename ? `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf` : 'course.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch experts from API
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL}/advisory/experts/`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExperts(data.results || data);
    } catch (err) {
      setError('Failed to load experts. Please try again.');
      console.error('Error fetching experts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL}/advisory/resources/`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResources(data.results || data);
    } catch (err) {
      setError('Failed to load resources. Please try again.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL}/advisory/courses/`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.results || data);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch advisory content from API
  const fetchAdvisoryContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${API_BASE_URL}/advisory/advisory-content/`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdvisoryContent(data.results || data);
    } catch (err) {
      setError('Failed to load advisory content. Please try again.');
      console.error('Error fetching advisory content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Book consultation with expert
  const handleBookConsultation = async (expert) => {
    if (!user) {
      alert('Please log in to book a consultation.');
      return;
    }

    setSelectedExpert(expert);
    setShowBookingModal(true);
  };

  // Confirm booking and redirect to Calendly
  const confirmBooking = async () => {
    if (!selectedExpert) return;

    try {
      setBookingLoading(true);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/experts/${selectedExpert.id}/book_consultation/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book consultation');
      }

      const data = await response.json();
      
      // Redirect to Calendly
      if (data.calendly_link) {
        window.open(data.calendly_link, '_blank');
      }
      
      setShowBookingModal(false);
      setSelectedExpert(null);
      
    } catch (err) {
      alert(err.message || 'Failed to book consultation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle course generation success
  const handleCourseGenerationSuccess = (newCourse) => {
    // Add the new course to the list
    setCourses(prev => [newCourse, ...prev]);
    setShowCourseModal(false);
  };

  // Load data based on selected tab
  useEffect(() => {
    if (selectedTab === "advice") {
      fetchExperts();
    } else if (selectedTab === "resources") {
      fetchResources();
    } else if (selectedTab === "courses") {
      fetchCourses();
    }
  }, [selectedTab]);

  // Filter experts based on search and category
  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || expert.specialization.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Filter resources based on search and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter courses based on search and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { 
      id: "advice", 
      label: "Expert Advice", 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "courses", 
      label: "AI Courses", 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
        </motion.svg>
      )
    },
    { 
      id: "resources", 
      label: "Resources", 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
        </motion.svg>
      )
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 overflow-hidden">
      {/* Agricultural Education Background */}
      <div className="absolute inset-0">
        {/* Primary Agricultural Learning Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='eduGrad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%2334d399;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236ee7b7;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='900' fill='url(%23eduGrad1)' /%3E%3Cg%3E%3Cpath d='M0 700 Q400 650 800 700 T1600 700 L1600 900 L0 900 Z' fill='%23059669' opacity='0.7'/%3E%3Cpath d='M0 750 Q400 720 800 750 T1600 750 L1600 900 L0 900 Z' fill='%23047857' opacity='0.5'/%3E%3C/g%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Crect x='100' y='150' width='120' height='80' rx='8' /%3E%3Crect x='300' y='200' width='100' height='60' rx='6' /%3E%3Crect x='500' y='120' width='140' height='90' rx='10' /%3E%3Crect x='800' y='180' width='110' height='70' rx='8' /%3E%3Crect x='1100' y='140' width='130' height='85' rx='8' /%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Educational Field Patterns */}
        <div className="absolute bottom-0 w-full">
          {/* Learning Fields Background */}
          <div 
            className="absolute bottom-0 w-full h-36 opacity-15"
            style={{
              background: 'linear-gradient(to right, #047857 0%, #059669 50%, #0d9488 100%)',
              clipPath: 'polygon(0 100%, 0 25%, 25% 15%, 50% 30%, 75% 10%, 100% 20%, 100% 100%)'
            }}
          />
          <div 
            className="absolute bottom-0 w-full h-28 opacity-20"
            style={{
              background: 'linear-gradient(to right, #059669 0%, #0d9488 50%, #14b8a6 100%)',
              clipPath: 'polygon(0 100%, 0 45%, 30% 35%, 60% 50%, 85% 30%, 100% 40%, 100% 100%)'
            }}
          />
          <div 
            className="absolute bottom-0 w-full h-20 opacity-25"
            style={{
              background: 'linear-gradient(to right, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
              clipPath: 'polygon(0 100%, 0 65%, 40% 55%, 70% 70%, 100% 60%, 100% 100%)'
            }}
          />
        </div>

        {/* Floating Educational Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Books */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`book-${i}`}
              className="absolute opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            >
              <BookOpen className="w-12 h-12 text-blue-300" />
            </motion.div>
          ))}
        </div>

        {/* Knowledge Network Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.15'%3E%3Ccircle cx='20' cy='20' r='8'/%3E%3Ccircle cx='80' cy='20' r='6'/%3E%3Ccircle cx='50' cy='50' r='10'/%3E%3Ccircle cx='20' cy='80' r='7'/%3E%3Ccircle cx='80' cy='80' r='9'/%3E%3Cpath d='M20 20 L50 50 L80 20 M20 80 L50 50 L80 80' stroke='%2310b981' stroke-width='2' stroke-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6"
            >
              <motion.svg 
                className="w-5 h-5 mr-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </motion.svg>
              Expert Agricultural Advisory
            </motion.div>
            
            <h1 className="heading-lg text-gray-900 mb-6">
              Learn from the <span className="text-gradient">Best Experts</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access world-class agricultural knowledge, expert consultations, and comprehensive 
              training resources to transform your farming practices.
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedTab === tab.id
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    <span className={selectedTab === tab.id ? "text-white" : "text-emerald-600"}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {selectedTab === "advice" && (
              <motion.div
                key="advice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {loading ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading experts...</p>
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-12 text-red-600">
                    {error}
                  </div>
                ) : filteredExperts.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No experts found. Try adjusting your search or filters.
                  </div>
                ) : (
                  filteredExperts.map((expert, index) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="mr-4"
                      >
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            {expert.profile_image ? (
                              <img 
                                src={expert.profile_image} 
                                alt={expert.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-10 h-10 text-green-600" />
                            )}
                          </div>
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900">{expert.name}</h3>
                        <p className="text-sm text-gray-600">{expert.specialization}</p>
                          <p className="text-xs text-emerald-600 font-medium">{expert.experience_years} years experience</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                          <Star className="w-4 h-4 text-orange-400 mr-1" />
                        {expert.rating}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          {expert.region || "Location not specified"}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                          {expert.consultation_price} ETB/hour
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 italic">"{expert.bio}"</p>
                    </div>
                    
                      <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                          expert.availability === "available" 
                          ? "bg-green-100 text-green-700" 
                            : expert.availability === "busy"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {expert.availability.charAt(0).toUpperCase() + expert.availability.slice(1)}
                        </span>
                        {expert.verified && (
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {expert.languages && expert.languages.slice(0, 2).map((lang, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {lang}
                      </span>
                          ))}
                        </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                          onClick={() => handleBookConsultation(expert)}
                          disabled={expert.availability === "unavailable" || !expert.calendly_connected}
                          className={`text-sm px-4 py-2 rounded-xl font-medium transition-colors ${
                            expert.availability === "unavailable" || !expert.calendly_connected
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {expert.availability === "unavailable" 
                            ? "Unavailable" 
                            : !expert.calendly_connected 
                            ? "Not Connected" 
                            : "Book Consultation"}
                      </motion.button>
                    </div>
                  </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {selectedTab === "courses" && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* AI Course Generation Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">AI-Powered Courses</h3>
                        <p className="text-gray-600">Generate personalized agricultural learning courses</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCourseModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Course</span>
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <span>Personalized Learning</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-green-500" />
                      <span>Structured Modules</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-emerald-500" />
                      <span>Practical Exercises</span>
                    </div>
                  </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loading ? (
                    <div className="col-span-full text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading courses...</p>
                    </div>
                  ) : error ? (
                    <div className="col-span-full text-center py-12 text-red-600">
                      {error}
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No courses found. Generate your first personalized course!
                    </div>
                  ) : (
                    filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          {course.image ? (
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <GraduationCap className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {course.difficulty}
                          </span>
                          {course.is_ai_generated && (
                            <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>AI Generated</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.views} views</span>
                        </div>
                      </div>
                      
                      {course.download_url ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDownload(course.download_url, course.title)}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Course</span>
                        </motion.button>
                      ) : (
                        <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-medium text-center">
                          Course in Development
                        </div>
                      )}
                    </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {selectedTab === "resources" && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {loading ? (
                    <div className="col-span-full text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading resources...</p>
                    </div>
                  ) : error ? (
                    <div className="col-span-full text-center py-12 text-red-600">
                      {error}
                    </div>
                  ) : filteredResources.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No resources found. Try adjusting your search or filters.
                    </div>
                  ) : (
                    filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          {resource.image ? (
                            <img 
                              src={resource.image} 
                              alt={resource.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {resource.resource_type}
                          </span>
                          {resource.is_ai_generated && (
                            <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>AI Generated</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div>{resource.downloads} downloads</div>
                        <div>{resource.file_size}</div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open(resource.file_url, '_blank')}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                      >
                        Download
                      </motion.button>
                    </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedExpert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
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
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Consultation</h2>
                  <p className="text-gray-600">Schedule a consultation with {selectedExpert.name}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      {selectedExpert.profile_image ? (
                        <img 
                          src={selectedExpert.profile_image} 
                          alt={selectedExpert.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedExpert.name}</h3>
                      <p className="text-sm text-gray-600">{selectedExpert.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-orange-400 mr-2" />
                      <span>{selectedExpert.rating} rating</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                      <span>{selectedExpert.consultation_price} ETB/hour</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedExpert.region || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      <span>{selectedExpert.experience_years} years experience</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Calendly Booking</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You'll be redirected to {selectedExpert.name}'s Calendly page to select your preferred time slot.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      disabled={bookingLoading}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBooking}
                      disabled={bookingLoading}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {bookingLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Redirecting...</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>Book Now</span>
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

      {/* AI Generation Modal */}
      <CourseGenerationModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSuccess={handleCourseGenerationSuccess}
      />
    </div>
  );
};

export default Advisory;