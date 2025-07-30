import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sprout, BookOpen } from 'lucide-react';

const Advisory = () => {
  const [selectedTab, setSelectedTab] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const experts = [
    {
      id: 1,
      name: "Dr. Alemayehu Bekele",
      specialization: "Crop Management",
      experience: "15 years",
      rating: 4.9,
      image: (
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
            alt="Dr. Alemayehu Bekele"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      bio: "Expert in sustainable farming practices and crop rotation techniques.",
      availability: "Available",
      consultationPrice: "500 ETB/hour",
      languages: ["Amharic", "English"]
    },
    {
      id: 2,
      name: "Sara Mekonnen",
      specialization: "Livestock Management", 
      experience: "12 years",
      rating: 4.8,
      image: (
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
            alt="Sara Mekonnen"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      bio: "Specializes in dairy farming and animal nutrition programs.",
      availability: "Busy",
      consultationPrice: "450 ETB/hour",
      languages: ["Amharic", "English", "Oromo"]
    },
    {
      id: 3,
      name: "Dr. Tadesse Worku",
      specialization: "Soil Science",
      experience: "20 years", 
      rating: 4.9,
      image: (
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Dr. Tadesse Worku"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      bio: "Leading researcher in soil health and fertilizer optimization.",
      availability: "Available",
      consultationPrice: "600 ETB/hour",
      languages: ["Amharic", "English"]
    },
    {
      id: 4,
      name: "Meron Alemu",
      specialization: "Agricultural Technology",
      experience: "8 years",
      rating: 4.7,
      image: (
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b75c?w=150&h=150&fit=crop&crop=face"
            alt="Meron Alemu"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      bio: "Specialist in modern farming technology and precision agriculture.",
      availability: "Available",
      consultationPrice: "400 ETB/hour",
      languages: ["Amharic", "English"]
    },
    {
      id: 5,
      name: "Dr. Berhanu Gebre",
      specialization: "Climate Adaptation",
      experience: "18 years",
      rating: 4.8,
      image: (
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Dr. Berhanu Gebre"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      bio: "Expert in climate-smart agriculture and drought-resistant farming.",
      availability: "Available",
      consultationPrice: "550 ETB/hour",
      languages: ["Amharic", "English"]
    },
    {
      id: 6,
      name: "Tigist Haile",
      specialization: "Organic Farming",
      experience: "10 years",
      rating: 4.6,
      image: (
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
            alt="Tigist Haile"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      bio: "Certified organic farming consultant and sustainable agriculture advocate.",
      availability: "Available",
      consultationPrice: "350 ETB/hour",
      languages: ["Amharic", "English"],
      certifications: ["Organic Certification Expert", "Permaculture Designer"]
    }
  ];

  const guides = [
    {
      id: 1,
      title: "Organic Farming Best Practices",
      category: "farming",
      difficulty: "Beginner",
      duration: "45 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop"
            alt="Organic Farming Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Learn the fundamentals of organic farming, including soil preparation, natural pest control, and sustainable harvesting techniques.",
      author: "Dr. Alemayehu Bekele",
      views: 2450,
      rating: 4.8,
      modules: ["Soil Health", "Composting", "Natural Pest Control", "Certification Process"],
      price: "Free"
    },
    {
      id: 2,
      title: "Seasonal Crop Planning Guide",
      category: "planning",
      difficulty: "Intermediate", 
      duration: "60 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop"
            alt="Crop Planning Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Comprehensive guide to planning your crops according to Ethiopian seasons, weather patterns, and market demand.",
      author: "Sara Mekonnen",
      views: 1870,
      rating: 4.7,
      modules: ["Seasonal Calendar", "Market Analysis", "Risk Management", "Crop Rotation"],
      price: "299 ETB"
    },
    {
      id: 3,
      title: "Modern Irrigation Techniques",
      category: "technology",
      difficulty: "Advanced",
      duration: "90 mins", 
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
            alt="Irrigation Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Master efficient irrigation systems including drip irrigation, sprinkler systems, and water conservation methods.",
      author: "Dr. Tadesse Worku",
      views: 3120,
      rating: 4.9,
      modules: ["Drip Systems", "Smart Irrigation", "Water Management", "System Maintenance"],
      price: "499 ETB"
    },
    {
      id: 4,
      title: "Precision Agriculture with Drones",
      category: "technology",
      difficulty: "Advanced",
      duration: "120 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop"
            alt="Drone Technology Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Learn how to use drone technology for crop monitoring, soil analysis, and precision application of inputs.",
      author: "Meron Alemu",
      views: 1560,
      rating: 4.8,
      modules: ["Drone Operations", "Data Analysis", "Mapping Techniques", "ROI Calculation"],
      price: "799 ETB"
    },
    {
      id: 5,
      title: "Climate-Smart Agriculture",
      category: "climate",
      difficulty: "Intermediate",
      duration: "75 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
            alt="Climate Smart Agriculture Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Strategies for adapting farming practices to climate change and building resilient agricultural systems.",
      author: "Dr. Berhanu Gebre",
      views: 2100,
      rating: 4.7,
      modules: ["Climate Adaptation", "Drought Management", "Resilient Varieties", "Risk Assessment"],
      price: "399 ETB"
    },
    {
      id: 6,
      title: "Livestock Management Essentials",
      category: "livestock",
      difficulty: "Beginner",
      duration: "55 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1560457079-9a6532ccb118?w=400&h=300&fit=crop"
            alt="Livestock Management Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Complete guide to livestock management including feeding, breeding, health management, and housing.",
      author: "Sara Mekonnen",
      views: 1890,
      rating: 4.6,
      modules: ["Animal Nutrition", "Breeding Techniques", "Health Management", "Housing Design"],
      price: "249 ETB"
    },
    {
      id: 7,
      title: "Sustainable Soil Management",
      category: "soil",
      difficulty: "Intermediate",
      duration: "70 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
            alt="Soil Management Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Learn advanced soil management techniques to improve fertility and prevent degradation.",
      author: "Dr. Tadesse Worku",
      views: 2300,
      rating: 4.8,
      modules: ["Soil Testing", "Nutrient Management", "Erosion Control", "Soil Amendment"],
      price: "349 ETB"
    },
    {
      id: 8,
      title: "Integrated Pest Management",
      category: "pest-control",
      difficulty: "Intermediate",
      duration: "50 mins",
      image: (
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop"
            alt="Pest Management Course"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      description: "Comprehensive approach to pest control using biological, cultural, and minimal chemical methods.",
      author: "Tigist Haile",
      views: 1750,
      rating: 4.7,
      modules: ["Pest Identification", "Biological Control", "Cultural Practices", "Monitoring Systems"],
      price: "299 ETB"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Crop Disease Identification Manual",
      type: "PDF Guide",
      description: "Comprehensive visual guide for identifying common crop diseases in Ethiopian agriculture.",
      downloads: 1520,
      fileSize: "12.5 MB",
      category: "health",
      image: (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=64&h=64&fit=crop"
            alt="Disease Guide"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 2,
      title: "Fertilizer Application Calculator",
      type: "Excel Tool",
      description: "Calculate optimal fertilizer quantities based on soil tests and crop requirements.",
      downloads: 890,
      fileSize: "2.8 MB",
      category: "tools",
      image: (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=64&h=64&fit=crop"
            alt="Calculator Tool"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 3,
      title: "Ethiopian Agricultural Calendar",
      type: "PDF Reference",
      description: "Season-wise planting and harvesting guide for major crops in different Ethiopian regions.",
      downloads: 2340,
      fileSize: "8.1 MB",
      category: "planning",
      image: (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=64&h=64&fit=crop"
            alt="Calendar Guide"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 4,
      title: "Soil Testing Kit Instructions",
      type: "Video Guide",
      description: "Step-by-step video guide on how to use soil testing kits for optimal crop nutrition.",
      downloads: 670,
      fileSize: "45.2 MB",
      category: "soil",
      image: (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=64&h=64&fit=crop"
            alt="Soil Testing Guide"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 5,
      title: "Market Price Analysis Reports",
      type: "Data Reports",
      description: "Monthly analysis of agricultural commodity prices and market trends in Ethiopian markets.",
      downloads: 1150,
      fileSize: "15.7 MB",
      category: "market",
      image: (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=64&h=64&fit=crop"
            alt="Market Analysis"
            className="w-full h-full object-cover"
          />
        </div>
      )
    },
    {
      id: 6,
      title: "Organic Certification Handbook",
      type: "PDF Guide",
      description: "Complete guide to obtaining organic certification for your agricultural products in Ethiopia.",
      downloads: 450,
      fileSize: "6.9 MB",
      category: "certification",
      image: (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=64&h=64&fit=crop"
            alt="Certification Guide"
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
  ];

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
      label: "Training Courses", 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z"></path>
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
                {experts.map((expert, index) => (
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
                        {expert.image}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900">{expert.name}</h3>
                        <p className="text-sm text-gray-600">{expert.specialization}</p>
                        <p className="text-xs text-emerald-600 font-medium">{expert.experience}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <motion.svg 
                          className="w-4 h-4 text-orange-400 mr-1" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </motion.svg>
                        {expert.rating}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 italic">"{expert.bio}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        expert.availability === "Available" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {expert.availability}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Book Consultation
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {selectedTab === "courses" && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {guides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {guide.image}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          guide.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                          guide.difficulty === "Intermediate" ? "bg-orange-100 text-orange-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {guide.difficulty}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-emerald-600">
                        {guide.duration}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <motion.svg 
                            className="w-4 h-4 mr-1" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </motion.svg>
                          {guide.author}
                        </div>
                        <div>{guide.views} views</div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <motion.svg 
                            className="w-4 h-4 text-orange-400 mr-1" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </motion.svg>
                          {guide.rating}
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full btn-primary"
                      >
                        Enroll Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {selectedTab === "resources" && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      {resource.image}
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {resource.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div>{resource.downloads} downloads</div>
                      <div>{resource.fileSize}</div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-secondary border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <motion.svg 
                        className="w-4 h-4 mr-2" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </motion.svg>
                      Download
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Advisory;