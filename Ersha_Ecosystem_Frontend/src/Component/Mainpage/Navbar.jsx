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
  LogOut,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useLocale } from "../../contexts/LocaleContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const Navbar = ({ setActiveView, onAuthClick, onUserProfileClick }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user } = useAuth();
  const { cartSummary } = useCart();
  const { t } = useLocale();

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
      label: t('navigation.home'), 
      icon: <Home className="w-5 h-5" />,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'marketplace', 
      label: t('navigation.marketplace'), 
      icon: <ShoppingBag className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'weather', 
      label: t('navigation.weather'), 
      icon: <Cloud className="w-5 h-5" />,
      gradient: 'from-sky-500 to-blue-600'
    },
    { 
      id: 'advisory', 
      label: t('navigation.advisory'), 
      icon: <Phone className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-600'
    },
    { 
      id: 'news', 
      label: t('navigation.news'), 
      icon: <Newspaper className="w-5 h-5" />,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'fayda',
      label: t('navigation.faydaId'),
      icon: <User className="w-5 h-5 mr-2" />,
      gradient: 'from-green-600 to-teal-600'
    }
  ];

  // Add dashboard item for authenticated users
  const authenticatedNavItems = user ? [
    { 
      id: 'dashboard', 
      label: t('navigation.dashboard'), 
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: 'from-indigo-500 to-purple-600'
    },
    ...navItems
  ] : navItems;

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsOpen(false);
    
    // If user is authenticated, navigate to dashboard with the specific view
    if (user) {
      if (itemId === 'fayda') {
        navigate('/fayda-id');
      } else if (itemId === 'dashboard') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
        // The dashboard will handle the view switching internally
      }
    } else {
      // For non-authenticated users, navigate to home page
      if (itemId === 'fayda') {
        navigate('/fayda-id');
      } else {
        navigate('/');
        setActiveView && setActiveView(itemId);
      }
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
                  {t('brand.name')}
                </h1>
                <p className="text-xs text-gray-500 -mt-1">{t('brand.tagline')}</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {authenticatedNavItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === item.id
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  
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
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Cart Icon */}
              {user && (
                <motion.button
                  onClick={() => navigate('/cart')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                  data-cart-icon
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{t('navigation.cart')}</span>
                  {cartSummary.totalItems > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    >
                      {cartSummary.totalItems}
                    </motion.div>
                  )}
                </motion.button>
              )}
              
              {user ? (
                <motion.button
                  onClick={onUserProfileClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>{t('navigation.profile')}</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    {t('navigation.signIn')}
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t('navigation.getStarted')}
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
                {authenticatedNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    } ${activeTab === item.id ? item.gradient : ''}`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {/* Mobile Language Switcher */}
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                  
                  {/* Mobile Cart Button */}
                  {user && (
                    <button 
                      onClick={() => navigate('/cart')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200 relative"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t('navigation.cart')}</span>
                      {cartSummary.totalItems > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {cartSummary.totalItems}
                        </div>
                      )}
                    </button>
                  )}
                  
                  {user ? (
                    <button 
                      onClick={onUserProfileClick}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('navigation.profile')}</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => navigate('/login')}
                        className="w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                      >
                        {t('navigation.signIn')}
                      </button>
                      <button 
                        onClick={() => navigate('/register')}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg"
                      >
                        {t('navigation.getStarted')}
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