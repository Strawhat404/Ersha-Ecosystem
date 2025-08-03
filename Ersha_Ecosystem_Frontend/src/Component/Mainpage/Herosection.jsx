import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  Play,
  Sprout,
  Cloud,
  ShoppingBag,
  Phone
} from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

const Herosection = () => {
  const { t } = useLocale();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic Background - Agricultural Landscape */}
      <div className="absolute inset-0">
        {/* Primary Background - Agricultural Field */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(
              135deg,
              rgba(34, 197, 94, 0.8) 0%,
              rgba(16, 185, 129, 0.7) 25%,
              rgba(5, 150, 105, 0.6) 50%,
              rgba(6, 78, 59, 0.8) 100%
            ), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23064e3b' points='957,450 539,900 1396,900'/%3E%3Cpolygon fill='%23065f46' points='957,450 872.9,900 1396,900'/%3E%3Cpolygon fill='%23047857' points='-60,900 398,662 816,900'/%3E%3Cpolygon fill='%23059669' points='337,900 398,662 816,900'/%3E%3Cpolygon fill='%230d9488' points='1203,546 1552,900 876,900'/%3E%3Cpolygon fill='%2314b8a6' points='1203,546 1552,900 1162,900'/%3E%3Cpolygon fill='%232dd4bf' points='641,695 886,900 367,900'/%3E%3Cpolygon fill='%235eead4' points='587,900 641,695 886,900'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Layered Mountain Silhouettes */}
        <div className="absolute bottom-0 w-full">
          {/* Back Mountains */}
          <div 
            className="absolute bottom-0 w-full h-32 sm:h-48 lg:h-64 opacity-30"
            style={{
              background: 'linear-gradient(to right, #064e3b 0%, #065f46 50%, #047857 100%)',
              clipPath: 'polygon(0 100%, 0 60%, 25% 45%, 50% 55%, 75% 40%, 100% 50%, 100% 100%)'
            }}
          />
          
          {/* Middle Mountains */}
          <div 
            className="absolute bottom-0 w-full h-24 sm:h-36 lg:h-48 opacity-50"
            style={{
              background: 'linear-gradient(to right, #047857 0%, #059669 50%, #0d9488 100%)',
              clipPath: 'polygon(0 100%, 0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 55%, 100% 100%)'
            }}
          />
          
          {/* Front Hills */}
          <div 
            className="absolute bottom-0 w-full h-16 sm:h-24 lg:h-32 opacity-70"
            style={{
              background: 'linear-gradient(to right, #059669 0%, #0d9488 50%, #14b8a6 100%)',
              clipPath: 'polygon(0 100%, 0 80%, 30% 65%, 50% 75%, 70% 60%, 100% 70%, 100% 100%)'
            }}
          />
        </div>

        {/* Floating Agricultural Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Leaves */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: -50,
                rotate: 0,
                opacity: 0.7
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                rotate: 360,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
              }}
              transition={{
                duration: Math.random() * 8 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              <Sprout 
                className="text-green-200/40" 
                size={Math.random() * 20 + 15}
              />
            </motion.div>
          ))}
          
          {/* Floating Seeds/Particles */}
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-green-200/30 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: -10,
                opacity: 0.8
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                opacity: 0
              }}
              transition={{
                duration: Math.random() * 6 + 8,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white text-center lg:text-left"
            >
              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-4">
                  <span className="block text-white drop-shadow-2xl">{t('brand.agroLife').split(' ')[0]}</span>
                  <span className="block bg-gradient-to-r from-green-200 via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-xl">
                    {t('brand.agroLife').split(' ')[1]}
                  </span>
                  <span className="block text-white drop-shadow-2xl">{t('brand.agroLife').split(' ')[2]}</span>
                </h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-lg sm:text-xl lg:text-2xl font-light text-green-100 italic"
                >
                  {t('brand.agriculturalMarketplace')}
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                {t('hero.title')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-12 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white text-green-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center"
                >
                  <span>{t('hero.exploreMarketplace')}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span>{t('hero.watchDemo')}</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-300 mr-1 sm:mr-2" />
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">12K+</span>
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm">{t('hero.stats.activeFarmers')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green-300 mr-1 sm:mr-2" />
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">2.5M</span>
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm">{t('hero.stats.monthlyTrade')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-green-300 mr-1 sm:mr-2" />
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">98%</span>
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm">{t('hero.stats.successRate')}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative mt-8 lg:mt-0"
            >
              {/* Feature Cards */}
              <div className="space-y-4 sm:space-y-6 max-w-md mx-auto lg:max-w-none">
                {/* Weather Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{t('weather.title')}</h3>
                      <p className="text-green-100 text-xs sm:text-sm">Real-time weather updates</p>
                    </div>
                  </div>
                </motion.div>

                {/* Marketplace Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{t('marketplace.title')}</h3>
                      <p className="text-green-100 text-xs sm:text-sm">Direct farmer connections</p>
                    </div>
                  </div>
                </motion.div>

                {/* Advisory Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{t('advisory.title')}</h3>
                      <p className="text-green-100 text-xs sm:text-sm">Expert guidance</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Herosection; 