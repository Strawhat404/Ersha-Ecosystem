import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Download, 
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Clock,
  Target,
  MapPin,
  Leaf
} from 'lucide-react';

const CourseGenerationModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [userDataSummary, setUserDataSummary] = useState({});
  
  // Form data for custom course
  const [customCourse, setCustomCourse] = useState({
    title: "",
    description: ""
  });

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

  // Fetch course recommendations
  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      setError("");
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/courses/get_course_recommendations/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setUserDataSummary(data.user_data_summary || {});
      
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Generate course
  const generateCourse = async (courseData) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/advisory/courses/generate_ai_course/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate course');
      }

      const data = await response.json();
      setGeneratedCourse(data);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(data);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to generate course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle recommendation click
  const handleRecommendationClick = (recommendation) => {
    setCustomCourse({
      title: recommendation.title,
      description: recommendation.description
    });
  };

  // Handle custom course generation
  const handleCustomCourseGeneration = () => {
    if (!customCourse.title.trim() || !customCourse.description.trim()) {
      setError('Please provide both title and description for the course.');
      return;
    }
    generateCourse(customCourse);
  };

  // Reset form
  const resetForm = () => {
    setCustomCourse({
      title: "",
      description: ""
    });
    setError("");
    setSuccess(false);
    setGeneratedCourse(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Load recommendations when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'farming':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'climate':
        return <MapPin className="w-4 h-4 text-blue-600" />;
      case 'soil':
        return <Target className="w-4 h-4 text-orange-600" />;
      case 'planning':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      default:
        return <GraduationCap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Course Recommendations</h3>
        <p className="text-gray-600">Based on your farming profile and activities</p>
      </div>

      {/* User Data Summary */}
      {Object.keys(userDataSummary).length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Your Farming Profile</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {userDataSummary.region && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">{userDataSummary.region}</span>
              </div>
            )}
            {userDataSummary.farm_size && (
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-green-700">{userDataSummary.farm_size} hectares</span>
              </div>
            )}
            {userDataSummary.total_products > 0 && (
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700">{userDataSummary.total_products} products</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      {recommendationsLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading personalized recommendations...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
              onClick={() => handleRecommendationClick(recommendation)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(recommendation.category)}
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {recommendation.category}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(recommendation.difficulty)}`}>
                  {recommendation.difficulty}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{recommendation.duration}</span>
                </div>
                <span className="text-blue-600 font-medium">{recommendation.reason}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No recommendations available. Try creating a custom course.</p>
        </div>
      )}

      {/* Custom Course Section */}
      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Create Custom Course</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              value={customCourse.title}
              onChange={(e) => setCustomCourse(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Advanced Maize Farming Techniques"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
            <textarea
              value={customCourse.description}
              onChange={(e) => setCustomCourse(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you want to learn in this course..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Course Generated Successfully!</h3>
        <p className="text-gray-600 mb-4">Your personalized agricultural course is ready for download.</p>
      </div>
      
      {generatedCourse && (
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <h4 className="font-semibold text-gray-900 mb-2">{generatedCourse.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{generatedCourse.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Duration: {generatedCourse.duration}</span>
            <span>File size: {generatedCourse.file_size}</span>
          </div>
        </div>
      )}
      
      <div className="flex space-x-3">
        <button
          onClick={() => handleDownload(generatedCourse?.download_url, generatedCourse?.title)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Course</span>
        </button>
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Course Generator</h2>
                    <p className="text-sm text-gray-600">Create personalized agricultural courses</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              {/* Content */}
              <div className="mb-6">
                {success ? renderSuccess() : renderRecommendations()}
              </div>

              {/* Navigation */}
              {!success && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomCourseGeneration}
                    disabled={loading || !customCourse.title.trim() || !customCourse.description.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Course</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourseGenerationModal; 