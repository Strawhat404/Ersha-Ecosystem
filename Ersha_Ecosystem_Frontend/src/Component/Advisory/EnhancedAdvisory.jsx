import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EnhancedAdvisory = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [advisoryContent, setAdvisoryContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate fetching advisory content
    const fetchAdvisoryData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAdvisoryContent = [
        {
          id: 1,
          title: "Integrated Pest Management for Coffee Plants",
          category: "pest_control",
          crop: "coffee",
          region: "oromia",
          season: "dry",
          difficulty: "intermediate",
          readTime: "8 min",
          author: "Dr. Alemayehu Bekele",
          authorRole: "Agricultural Extension Officer",
          publishedDate: "2024-03-15",
          image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop&crop=center",
          excerpt: "Learn effective strategies to control coffee berry borer and leaf rust while maintaining organic certification.",
          content: {
            introduction: "Integrated Pest Management (IPM) is crucial for sustainable coffee production...",
            steps: [
              "Regular monitoring and early detection",
              "Biological control agents",
              "Cultural practices",
              "Targeted chemical intervention"
            ],
            tips: [
              "Monitor plants weekly during flowering season",
              "Use sticky traps for early detection",
              "Maintain proper spacing for air circulation"
            ]
          },
          tags: ["organic", "sustainable", "coffee berry borer", "leaf rust"],
          rating: 4.8,
          views: 1250,
          bookmarked: 340
        },
        {
          id: 2,
          title: "Soil Enrichment Techniques for Vegetable Farming",
          category: "soil_enrichment",
          crop: "vegetables",
          region: "amhara",
          season: "rainy",
          difficulty: "beginner",
          readTime: "6 min",
          author: "Engineer Tigist Alemu",
          authorRole: "Soil Conservation Specialist",
          publishedDate: "2024-03-12",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop&crop=center",
          excerpt: "Comprehensive guide to improving soil fertility using organic matter and proper drainage techniques.",
          content: {
            introduction: "Healthy soil is the foundation of productive vegetable farming...",
            steps: [
              "Soil testing and analysis",
              "Organic matter incorporation",
              "Proper drainage systems",
              "Crop rotation planning"
            ],
            tips: [
              "Test soil pH annually",
              "Add compost regularly",
              "Avoid overwatering"
            ]
          },
          tags: ["soil health", "organic matter", "drainage", "crop rotation"],
          rating: 4.6,
          views: 980,
          bookmarked: 245
        },
        {
          id: 3,
          title: "Optimal Harvesting Time for Cereal Crops",
          category: "harvesting",
          crop: "cereals",
          region: "tigray",
          season: "dry",
          difficulty: "intermediate",
          readTime: "10 min",
          author: "Dr. Mehari Gebreyohannes",
          authorRole: "Crop Production Specialist",
          publishedDate: "2024-03-10",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop&crop=center",
          excerpt: "Master the art of timing your harvest to maximize yield and grain quality for wheat, barley, and teff.",
          content: {
            introduction: "Proper timing of harvest is critical for maximizing both quantity and quality...",
            steps: [
              "Visual assessment techniques",
              "Moisture content testing",
              "Weather consideration",
              "Post-harvest handling"
            ],
            tips: [
              "Harvest early morning when moisture is ideal",
              "Check multiple plants across the field",
              "Have storage ready before harvesting"
            ]
          },
          tags: ["harvest timing", "grain quality", "moisture content", "weather"],
          rating: 4.9,
          views: 1450,
          bookmarked: 420
        },
        {
          id: 4,
          title: "Water Management for Drought-Resistant Crops",
          category: "water_management",
          crop: "sorghum",
          region: "somali",
          season: "dry",
          difficulty: "advanced",
          readTime: "12 min",
          author: "Dr. Fatuma Hassan",
          authorRole: "Irrigation Specialist",
          publishedDate: "2024-03-08",
          image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop&crop=center",
          excerpt: "Advanced techniques for water conservation and efficient irrigation in arid regions.",
          content: {
            introduction: "Water scarcity requires innovative approaches to crop production...",
            steps: [
              "Drip irrigation setup",
              "Mulching strategies",
              "Rainwater harvesting",
              "Drought monitoring"
            ],
            tips: [
              "Install moisture sensors",
              "Use reflective mulch",
              "Plant during optimal windows"
            ]
          },
          tags: ["drought resistance", "irrigation", "water conservation", "mulching"],
          rating: 4.7,
          views: 850,
          bookmarked: 280
        },
        {
          id: 5,
          title: "Organic Fertilizer Production from Farm Waste",
          category: "soil_enrichment",
          crop: "all",
          region: "all",
          season: "all",
          difficulty: "beginner",
          readTime: "5 min",
          author: "Ato Girma Tadesse",
          authorRole: "Organic Farming Expert",
          publishedDate: "2024-03-05",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop&crop=center",
          excerpt: "Step-by-step guide to creating nutrient-rich compost from agricultural waste materials.",
          content: {
            introduction: "Converting farm waste into valuable fertilizer reduces costs and improves sustainability...",
            steps: [
              "Waste material collection",
              "Proper composting ratios",
              "Temperature monitoring",
              "Application techniques"
            ],
            tips: [
              "Turn compost weekly",
              "Maintain proper moisture",
              "Use thermometer for monitoring"
            ]
          },
          tags: ["composting", "organic fertilizer", "waste management", "sustainability"],
          rating: 4.5,
          views: 1100,
          bookmarked: 380
        },
        {
          id: 6,
          title: "Pest Identification Guide for Legume Crops",
          category: "pest_control",
          crop: "legumes",
          region: "snnpr",
          season: "rainy",
          difficulty: "intermediate",
          readTime: "9 min",
          author: "Dr. Birtukan Mengistu",
          authorRole: "Entomologist",
          publishedDate: "2024-03-02",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop&crop=center",
          excerpt: "Visual guide to identifying common pests affecting beans, peas, and other legume crops.",
          content: {
            introduction: "Early identification of pests is key to effective management...",
            steps: [
              "Common pest identification",
              "Damage assessment",
              "Treatment selection",
              "Prevention strategies"
            ],
            tips: [
              "Check plants weekly",
              "Use magnifying glass for small insects",
              "Document pest findings"
            ]
          },
          tags: ["pest identification", "legumes", "damage assessment", "prevention"],
          rating: 4.6,
          views: 720,
          bookmarked: 190
        }
      ];

      setAdvisoryContent(mockAdvisoryContent);
      setLoading(false);
    };

    fetchAdvisoryData();
  }, []);

  const categories = [
    { id: "all", label: "All Topics", icon: "🌱", color: "from-green-500 to-green-600" },
    { id: "pest_control", label: "Pest Control", icon: "🐛", color: "from-red-500 to-red-600" },
    { id: "soil_enrichment", label: "Soil Health", icon: "🌍", color: "from-amber-500 to-amber-600" },
    { id: "harvesting", label: "Harvesting", icon: "🚜", color: "from-orange-500 to-orange-600" },
    { id: "water_management", label: "Water Management", icon: "💧", color: "from-blue-500 to-blue-600" }
  ];

  const crops = [
    { id: "all", label: "All Crops" },
    { id: "coffee", label: "Coffee" },
    { id: "vegetables", label: "Vegetables" },
    { id: "cereals", label: "Cereals" },
    { id: "legumes", label: "Legumes" },
    { id: "sorghum", label: "Sorghum" }
  ];

  const regions = [
    { id: "all", label: "All Regions" },
    { id: "oromia", label: "Oromia" },
    { id: "amhara", label: "Amhara" },
    { id: "tigray", label: "Tigray" },
    { id: "snnpr", label: "SNNPR" },
    { id: "somali", label: "Somali" }
  ];

  const seasons = [
    { id: "all", label: "All Seasons" },
    { id: "rainy", label: "Rainy Season" },
    { id: "dry", label: "Dry Season" },
    { id: "planting", label: "Planting Season" },
    { id: "harvest", label: "Harvest Season" }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-orange-100 text-orange-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredContent = advisoryContent.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesCrop = selectedCrop === "all" || item.crop === selectedCrop || item.crop === "all";
    const matchesRegion = selectedRegion === "all" || item.region === selectedRegion || item.region === "all";
    const matchesSeason = selectedSeason === "all" || item.season === selectedSeason || item.season === "all";
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesCrop && matchesRegion && matchesSeason && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-80 skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Agricultural Advisory Hub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Expert-curated guides and best practices tailored to your crop, region, and farming needs
        </p>
      </motion.div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides..."
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-input"
            >
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>{crop.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="form-input"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>{region.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="form-input"
            >
              {seasons.map(season => (
                <option key={season.id} value={season.id}>{season.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCrop("all");
                setSelectedRegion("all");
                setSelectedSeason("all");
                setSearchTerm("");
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <p className="text-gray-600">
          Showing {filteredContent.length} guide{filteredContent.length !== 1 ? 's' : ''} 
          {activeCategory !== "all" && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
        </p>
      </motion.div>

      {/* Advisory Content Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="wait">
          {filteredContent.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                  </motion.button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {guide.readTime}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {categories.find(c => c.id === guide.category)?.icon}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                      {guide.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{guide.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {guide.excerpt}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop&crop=face" 
                      alt={guide.author}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{guide.author}</span>
                  </div>
                  <span>•</span>
                  <span>{guide.publishedDate}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {guide.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {guide.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      +{guide.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>{guide.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                      </svg>
                      <span>{guide.bookmarked}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-sm"
                  >
                    Read Guide
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop&crop=center" 
            alt="No results"
            className="w-32 h-32 mx-auto rounded-full mb-4 opacity-50"
          />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No guides found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms to find more content.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSelectedCrop("all");
              setSelectedRegion("all");
              setSelectedSeason("all");
              setSearchTerm("");
            }}
            className="btn-primary"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 mt-12 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Need Personalized Advice?
        </h3>
        <p className="text-gray-600 mb-6">
          Connect with our agricultural experts for customized guidance based on your specific farming conditions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">
            📞 Contact Expert
          </button>
          <button className="btn-secondary">
            📝 Submit Question
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedAdvisory; 