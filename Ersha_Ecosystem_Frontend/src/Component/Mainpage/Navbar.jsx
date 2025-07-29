import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ShoppingBag, 
  Cloud, 
  Phone, 
  Newspaper,
  Sprout,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ setActiveView, onAuthClick, onUserProfileClick }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      
      setScrolled(scrollTop > 20);
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: <Home className="w-5 h-5" />,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'marketplace', 
      label: 'Marketplace', 
      icon: <ShoppingBag className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'weather', 
      label: 'Weather', 
      icon: <Cloud className="w-5 h-5" />,
      gradient: 'from-sky-500 to-blue-600'
    },
    { 
      id: 'advisory', 
      label: 'Advisory', 
      icon: <Phone className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-600'
    },
    { 
      id: 'news', 
      label: 'News', 
      icon: <Newspaper className="w-5 h-5" />,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'fayda',
      label: 'Fayda ID',
      icon: <User className="w-5 h-5 mr-2" />,
      gradient: 'from-green-600 to-teal-600'
    }
  ];

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsOpen(false);
    
    // --- CHANGE IS HERE ---
    if (itemId === 'fayda') {
      // If Fayda ID is clicked, navigate to its dedicated page
      navigate('/fayda-id');
    } else {
      // For all other links (Home, Marketplace, etc.), navigate to the main page
      navigate('/');
      // Then, tell the main page which view to display.
      // This will now work because you are on the correct page (`/`).
      setActiveView && setActiveView(itemId);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-green-500 via-orange-500 to-purple-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress }}
          style={{ transformOrigin: '0%' }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <nav className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavClick('home')}
            >
              <div className="relative">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sprout className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Ersha-Ecosystem
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Agricultural Platform</p>
              </div>
            </motion.div>

            {/* Desktop Navigation - Changed to custom 1000px breakpoint */}
            <div className="hidden min-[1000px]:flex items-center space-x-1 relative">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active background */}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl opacity-0 group-hover:opacity-20`}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Content */}
                  <div className="relative flex items-center space-x-2">
                    <motion.div
                      animate={activeTab === item.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Line hover effect */}
                  <motion.div
                    className={`absolute -bottom-2 left-1/2 h-0.5 bg-gradient-to-r ${item.gradient}`}
                    initial={{ width: 0, x: '-50%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Auth Buttons - Changed from md:flex to lg:flex */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <motion.button
                  onClick={onUserProfileClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile menu button - Changed to custom 1000px breakpoint */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="min-[1000px]:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation - Changed to custom 1000px breakpoint */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.button>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {user ? (
                    <button 
                      onClick={onUserProfileClick}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => navigate('/login')}
                        className="w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => navigate('/register')}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;