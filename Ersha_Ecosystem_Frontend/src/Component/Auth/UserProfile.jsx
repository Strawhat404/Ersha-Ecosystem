import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  LogOut,
  Settings,
  Shield,
  Leaf,
  ShoppingBag,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const UserProfile = ({ onClose }) => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    region: profile?.region || '',
    farm_size: profile?.farm_size || '',
    business_license: profile?.business_license || ''
  });

  const regions = [
    'Addis Ababa', 'Oromia', 'Amhara', 'SNNPR', 'Tigray', 
    'Afar', 'Somali', 'Benishangul-Gumuz', 'Gambella', 'Harari'
  ];

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'farmer':
        return <Leaf className="w-5 h-5 text-green-600" />;
      case 'buyer':
        return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'agricultural_business':
        return <Building className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'farmer':
        return 'Farmer';
      case 'buyer':
        return 'Buyer/Merchant';
      case 'agricultural_business':
        return 'Agricultural Business';
      default:
        return 'User';
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      region: profile?.region || '',
      farm_size: profile?.farm_size || '',
      business_license: profile?.business_license || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                <p className="text-sm text-gray-600">Manage your account information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Type Badge */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
            {getUserTypeIcon(profile?.user_type)}
            <span className="font-medium text-gray-700">
              {getUserTypeLabel(profile?.user_type)}
            </span>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl"
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-700">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Form */}
          <div className="space-y-4">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{user?.email}</span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile?.full_name || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="+251-9XX-XXX-XXX"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile?.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                {isEditing ? (
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{profile?.region || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your city or town"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{profile?.location || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Farm Size (for farmers) */}
            {profile?.user_type === 'farmer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (hectares)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.1"
                    value={formData.farm_size}
                    onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 2.5"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                    <Leaf className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">
                      {profile?.farm_size ? `${profile.farm_size} hectares` : 'Not provided'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Business License (for merchants) */}
            {profile?.user_type === 'agricultural_business' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.business_license}
                    onChange={(e) => setFormData({ ...formData, business_license: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your business license number"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                    <Building className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{profile?.business_license || 'Not provided'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSave}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>

            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile; 