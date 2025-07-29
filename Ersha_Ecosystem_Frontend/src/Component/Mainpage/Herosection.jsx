import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Zap,
  ArrowRight,
  Play,
  Sprout,
  Sun,
  Cloud
} from 'lucide-react';

const Herosection = () => {
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
            className="absolute bottom-0 w-full h-64 opacity-30"
            style={{
              background: 'linear-gradient(to right, #064e3b 0%, #065f46 50%, #047857 100%)',
              clipPath: 'polygon(0 100%, 0 60%, 25% 45%, 50% 55%, 75% 40%, 100% 50%, 100% 100%)'
            }}
          />
          
          {/* Middle Mountains */}
          <div 
            className="absolute bottom-0 w-full h-48 opacity-50"
            style={{
              background: 'linear-gradient(to right, #047857 0%, #059669 50%, #0d9488 100%)',
              clipPath: 'polygon(0 100%, 0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 55%, 100% 100%)'
            }}
          />
          
          {/* Front Hills */}
          <div 
            className="absolute bottom-0 w-full h-32 opacity-70"
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
                x: Math.random() * window.innerWidth,
                y: -50,
                rotate: 0,
                opacity: 0.7
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360,
                x: Math.random() * window.innerWidth
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
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Weather Elements */}
        <div className="absolute top-20 right-20">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sun className="w-16 h-16 text-yellow-300/60" />
          </motion.div>
        </div>

        <div className="absolute top-32 left-20">
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Cloud className="w-20 h-20 text-white/40" />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-left"
            >
              {/* Subtitle Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-medium mb-8"
              >
                <Sprout className="w-4 h-4 mr-2" />
                <span>AGRICULTURAL ECOSYSTEM</span>
              </motion.div>

              {/* Main Heading - Nature Life Style */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-6xl lg:text-8xl font-black leading-none mb-4">
                  <span className="block text-white drop-shadow-2xl">THE</span>
                  <span className="block bg-gradient-to-r from-green-200 via-emerald-100 to-teal-200 bg-clip-text text-transparent drop-shadow-xl">
                    AGRO
                  </span>
                  <span className="block text-white drop-shadow-2xl">LIFE</span>
                </h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="text-xl lg:text-2xl font-light text-green-100 italic"
                >
                  AGRICULTURAL MARKETPLACE
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-xl"
              >
                Step into the future of agriculture. Connect directly with farmers, 
                access real-time market data, and grow your agricultural business 
                through our comprehensive ecosystem.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white text-green-800 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="grid grid-cols-3 gap-8"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-green-300 mr-2" />
                    <span className="text-3xl font-bold text-white">12K+</span>
                  </div>
                  <div className="text-white/70 text-sm">Active Farmers</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-green-300 mr-2" />
                    <span className="text-3xl font-bold text-white">₹2.5M</span>
                  </div>
                  <div className="text-white/70 text-sm">Monthly Trade</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="w-6 h-6 text-green-300 mr-2" />
                    <span className="text-3xl font-bold text-white">98%</span>
                  </div>
                  <div className="text-white/70 text-sm">Success Rate</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {/* Feature Cards */}
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                      <Sprout className="w-6 h-6 text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Smart Farming</h3>
                      <p className="text-white/70">AI-powered agriculture insights</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                      <BarChart3 className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Market Analytics</h3>
                      <p className="text-white/70">Real-time price tracking</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Instant Connect</h3>
                      <p className="text-white/70">Direct farmer-buyer network</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Action Badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -right-8 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl"
              >
                🌱 Growing Together
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-1 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Herosection;