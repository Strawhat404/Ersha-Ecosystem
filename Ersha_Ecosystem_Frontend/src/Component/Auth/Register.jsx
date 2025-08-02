import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle,
  CheckCircle,
  Leaf,
  ShoppingBag,
  Users,
  Building,
  GraduationCap,
  Truck,
  Upload,
  MapPin
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
    userType: 'farmer',
    region: '',
    farmSize: '',
    businessLicense: '',
    areaOfExpertise: '',
    certificateOfExpertise: null,
    coverageAreas: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCoverageArea, setNewCoverageArea] = useState('');

  const { signUp } = useAuth();

  const userTypes = [
    { 
      id: 'farmer', 
      label: 'Farmer', 
      icon: <Leaf className="w-5 h-5" />,
      description: 'I grow and sell agricultural products'
    },
    { 
      id: 'buyer', 
      label: 'Buyer/Merchant', 
      icon: <ShoppingBag className="w-5 h-5" />,
      description: 'I buy agricultural products for resale'
    },
    { 
      id: 'expert', 
      label: 'Expert', 
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'I provide agricultural expertise and consulting'
    },
    { 
      id: 'logistics', 
      label: 'Logistics Company', 
      icon: <Truck className="w-5 h-5" />,
      description: 'We provide transportation and delivery services'
    }
  ];

  const regions = [
    'Addis Ababa', 'Oromia', 'Amhara', 'SNNPR', 'Tigray', 
    'Afar', 'Somali', 'Benishangul-Gumuz', 'Gambella', 'Harari'
  ];

  const expertiseAreas = [
    'Crop Production', 'Livestock Management', 'Soil Science', 
    'Agricultural Technology', 'Pest Management', 'Irrigation Systems',
    'Organic Farming', 'Sustainable Agriculture', 'Agricultural Economics',
    'Food Safety', 'Agricultural Extension', 'Research & Development'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        password_confirm: formData.password_confirm,
        user_type: formData.userType,
        phone: formData.phone,
        region: formData.region,
        farm_size: formData.farmSize ? parseFloat(formData.farmSize) : null,
        business_license_number: formData.businessLicense,
        area_of_expertise: formData.areaOfExpertise,
        certificate_of_expertise: formData.certificateOfExpertise,
        coverage_areas: formData.coverageAreas
      };

      const { error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Registration successful! Redirecting to dashboard...');
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      certificateOfExpertise: file
    });
  };

  const handleAddCoverageArea = () => {
    if (newCoverageArea.trim() && !formData.coverageAreas.includes(newCoverageArea.trim())) {
      setFormData({
        ...formData,
        coverageAreas: [...formData.coverageAreas, newCoverageArea.trim()]
      });
      setNewCoverageArea('');
    }
  };

  const handleRemoveCoverageArea = (area) => {
    setFormData({
      ...formData,
      coverageAreas: formData.coverageAreas.filter(a => a !== area)
    });
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6"
          >
            <Users className="h-10 w-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join AgroGebeya
          </h2>
          <p className="text-gray-600">
            Create your account and start your agricultural journey
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: type.id })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.userType === type.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        formData.userType === type.id ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {type.icon}
                      </div>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.userType === 'logistics' ? 'Company Name' : 'First Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder={formData.userType === 'logistics' ? 'Enter your company name' : 'Enter your first name'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.userType === 'logistics' ? 'Contact Person' : 'Last Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder={formData.userType === 'logistics' ? 'Enter contact person name' : 'Enter your last name'}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="+251-9XX-XXX-XXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select your region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farm Size (for farmers) */}
            {formData.userType === 'farmer' && (
              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (hectares)
                </label>
                <input
                  id="farmSize"
                  name="farmSize"
                  type="number"
                  step="0.1"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2.5"
                />
              </div>
            )}

            {/* Business License (for logistics) */}
            {formData.userType === 'logistics' && (
              <div>
                <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Registration Number
                </label>
                <input
                  id="businessLicense"
                  name="businessLicense"
                  type="text"
                  value={formData.businessLicense}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your company registration number"
                />
              </div>
            )}

            {/* Area of Expertise (for experts) */}
            {formData.userType === 'expert' && (
              <div>
                <label htmlFor="areaOfExpertise" className="block text-sm font-medium text-gray-700 mb-2">
                  Area of Expertise
                </label>
                <select
                  id="areaOfExpertise"
                  name="areaOfExpertise"
                  value={formData.areaOfExpertise}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select your area of expertise</option>
                  {expertiseAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Certificate of Expertise (for experts) */}
            {formData.userType === 'expert' && (
              <div>
                <label htmlFor="certificateOfExpertise" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate of Expertise
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="certificateOfExpertise"
                    name="certificateOfExpertise"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="block w-full pl-10 pr-3 py-3 text-sm text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
                {formData.certificateOfExpertise && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: {formData.certificateOfExpertise.name}
                  </p>
                )}
              </div>
            )}

            {/* Coverage Areas (for logistics) */}
            {formData.userType === 'logistics' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Coverage Areas
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={newCoverageArea}
                        onChange={(e) => setNewCoverageArea(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCoverageArea();
                          }
                        }}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter service area (e.g., Addis Ababa)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCoverageArea}
                      className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  {formData.coverageAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.coverageAreas.map((area, index) => (
                        <span key={index} className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          {area}
                          <button
                            type="button"
                            onClick={() => handleRemoveCoverageArea(area)}
                            className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={handleSwitchToLogin}
              className="font-medium text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 