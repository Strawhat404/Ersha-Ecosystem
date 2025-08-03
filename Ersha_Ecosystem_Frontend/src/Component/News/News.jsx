import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from '../../contexts/LocaleContext';

const News = () => {
  const { t } = useLocale();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { 
      id: "all", 
      name: t('news.categories.allNews'), 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "market", 
      name: t('news.categories.marketTrends'), 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
        </motion.svg>
      )
    },
    { 
      id: "technology", 
      name: t('news.categories.farmTech'), 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "climate", 
      name: t('news.categories.weatherClimate'), 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5z" clipRule="evenodd"></path>
        </motion.svg>
      )
    },
    { 
      id: "policy", 
      name: t('news.categories.policyRegulations'), 
      icon: (
        <motion.svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd"></path>
        </motion.svg>
      )
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Fetch news from Django backend API
        const response = await fetch('http://localhost:8000/api/news/');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const newsData = await response.json();
        
        // Transform backend data to match frontend format
        const transformedNews = newsData.results ? newsData.results.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || article.content.substring(0, 200) + '...',
          image: article.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=250&fit=crop&crop=center',
          category: article.category,
          author: article.author || 'Ersha Ecosystem',
          date: new Date(article.published_at).toISOString().split('T')[0],
          readTime: Math.ceil(article.content.length / 200) + ' min read',
          featured: article.featured,
          tags: Array.isArray(article.tags) ? article.tags : [],
          fullContent: article.content
        })) : [];
        
        // If no news from backend, use fallback data
        const fallbackNewsData = [
        {
          id: 1,
          title: "Ethiopian Coffee Exports Hit Record Highs in 2024",
          excerpt: "Coffee exports from Ethiopia reached unprecedented levels this quarter, driven by strong international demand and improved quality standards.",
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=250&fit=crop&crop=center",
          category: "market",
          author: "Dawit Negash",
          date: "2024-03-20",
          readTime: "5 min read",
          featured: true,
          tags: ["Export", "Coffee", "Market Analysis"],
          fullContent: "Ethiopian coffee exports have reached unprecedented levels in the first quarter of 2024, with total export revenues increasing by 35% compared to the same period last year. The surge is attributed to several factors including improved quality control measures, favorable weather conditions, and increased international demand for specialty Ethiopian coffee varieties. The Ethiopian Coffee and Tea Authority reports that premium coffee varieties, particularly those from the Yirgacheffe and Sidamo regions, have seen price increases of up to 40% in international markets. This boom is providing much-needed foreign currency for the country and improving livelihoods for over 4 million smallholder coffee farmers."
        },
        {
          id: 2,
          title: "Revolutionary Drone Technology Transforms Ethiopian Farms",
          excerpt: "New agricultural drones are helping farmers monitor crop health, optimize irrigation, and increase yields across the country.",
          image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=250&fit=crop&crop=center",
          category: "technology",
          author: "Sara Mekonnen",
          date: "2024-03-19",
          readTime: "4 min read",
          featured: false,
          tags: ["Innovation", "Drones", "Smart Farming"],
          fullContent: "Agricultural technology is revolutionizing farming practices across Ethiopia with the introduction of advanced drone systems. These unmanned aerial vehicles equipped with multispectral cameras and AI-powered analytics are helping farmers monitor crop health, detect pest infestations early, and optimize irrigation patterns. The Ministry of Agriculture, in partnership with tech companies, has launched a pilot program covering 500 farms across different regions. Early results show yield improvements of 20-30% and water usage reduction of up to 25%. The drones can cover large areas quickly, providing farmers with detailed maps showing crop health, soil moisture levels, and areas requiring immediate attention."
        },
        {
          id: 3,
          title: "Climate Change Adaptation Strategies for Ethiopian Agriculture",
          excerpt: "Experts discuss innovative approaches to help farmers adapt to changing climate patterns and maintain productivity.",
          image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=250&fit=crop&crop=center",
          category: "climate",
          author: "Dr. Alemayehu Bekele",
          date: "2024-03-18",
          readTime: "7 min read",
          featured: true,
          tags: ["Climate", "Adaptation", "Sustainability"],
          fullContent: "As climate change continues to pose challenges to agricultural productivity in Ethiopia, researchers and farmers are developing innovative adaptation strategies. A comprehensive study by the International Food Policy Research Institute reveals that drought-resistant crop varieties, improved water management systems, and diversified farming practices are key to maintaining agricultural productivity. The research highlights successful implementations of climate-smart agriculture techniques that have helped farmers in the Tigray and Amhara regions maintain yields despite irregular rainfall patterns. These strategies include conservation agriculture, agroforestry systems, and the use of indigenous crop varieties that are naturally adapted to local climate conditions."
        },
        {
          id: 4,
          title: "New Agricultural Policy Supports Small-Scale Farmers",
          excerpt: "Government announces comprehensive support package including subsidies, training programs, and market access initiatives.",
          image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop&crop=center",
          category: "policy",
          author: "Ministry of Agriculture",
          date: "2024-03-17",
          readTime: "6 min read",
          featured: false,
          tags: ["Policy", "Support", "Small Farmers"],
          fullContent: "The Ethiopian government has unveiled a comprehensive agricultural support package aimed at empowering small-scale farmers and improving food security. The new policy framework includes subsidized access to improved seeds and fertilizers, technical training programs, and enhanced market linkage initiatives. Under this program, over 2 million smallholder farmers will receive direct support through cooperatives and farmer producer organizations. The policy also establishes agricultural service centers in rural areas, providing farmers with access to modern farming equipment, storage facilities, and direct market connections. Financial inclusion measures include low-interest agricultural loans and crop insurance schemes to protect farmers against climate-related risks."
        },
        {
          id: 5,
          title: "Organic Farming Practices Show 40% Yield Increase",
          excerpt: "Research study reveals significant benefits of organic farming methods in Ethiopian highlands.",
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop&crop=center",
          category: "technology",
          author: "Agricultural Research Institute",
          date: "2024-03-16",
          readTime: "5 min read",
          featured: false,
          tags: ["Organic", "Research", "Yields"],
          fullContent: "A groundbreaking three-year study conducted by the Ethiopian Agricultural Research Institute demonstrates that organic farming practices can significantly increase crop yields while improving soil health. The research, conducted across 200 farms in the highlands, shows that organic methods using compost, crop rotation, and natural pest control achieved yield increases of up to 40% compared to conventional farming. The study particularly highlights the success of integrated pest management techniques and the use of indigenous knowledge combined with modern organic practices. Farmers participating in the program also reported reduced input costs and improved soil fertility, making their operations more sustainable and profitable in the long term."
        },
        {
          id: 6,
          title: "Wheat Prices Soar Amid Global Supply Chain Disruptions",
          excerpt: "Local wheat markets experience significant price volatility as international supply chains face ongoing challenges.",
          image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop&crop=center",
          category: "market",
          author: "Market Analysis Team",
          date: "2024-03-15",
          readTime: "4 min read",
          featured: false,
          tags: ["Wheat", "Prices", "Supply Chain"],
          fullContent: "Wheat prices in Ethiopian markets have experienced significant volatility over the past month, with local prices increasing by 25% due to global supply chain disruptions and regional conflicts affecting major wheat-producing countries. The Ethiopian Grain Trade Enterprise reports that while domestic wheat production has remained stable, the country's reliance on wheat imports for about 40% of its consumption makes it vulnerable to international price fluctuations. To address these challenges, the government is implementing emergency measures including the release of strategic grain reserves and accelerated distribution of wheat seeds to increase domestic production. Local farmers are being encouraged to expand wheat cultivation through subsidized inputs and guaranteed purchase agreements."
        },
        // Additional news items for comprehensive content
        {
          id: 7,
          title: "Mobile Banking Revolution Reaches Rural Farmers",
          excerpt: "Digital financial services are transforming how farmers access credit and manage their agricultural businesses.",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center",
          category: "technology",
          author: "Fintech Reporter",
          date: "2024-03-14",
          readTime: "5 min read",
          featured: false,
          tags: ["Mobile Banking", "Digital Finance", "Rural Development"],
          fullContent: "The introduction of mobile banking services is revolutionizing financial access for rural farmers across Ethiopia. New partnerships between banks, telecom companies, and agricultural cooperatives have made it possible for farmers to access credit, savings accounts, and insurance products through their mobile phones. The program has already reached over 1.5 million farmers, with digital transactions increasing by 300% in rural areas over the past year. Farmers can now receive payments for their crops directly to their mobile wallets, access weather-indexed insurance, and apply for agricultural loans without traveling to bank branches. This digital transformation is particularly beneficial for women farmers, who previously faced significant barriers to accessing formal financial services."
        },
        {
          id: 8,
          title: "Cooperative Farming Models Show Promise",
          excerpt: "Farmer cooperatives are demonstrating increased efficiency and profitability through collective action.",
          image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop&crop=center",
          category: "policy",
          author: "Cooperative Development Unit",
          date: "2024-03-13",
          readTime: "6 min read",
          featured: false,
          tags: ["Cooperatives", "Collective Farming", "Efficiency"],
          fullContent: "Agricultural cooperatives across Ethiopia are demonstrating the power of collective action in improving farmer livelihoods and agricultural productivity."
        }
      ];
      
      // Use backend news if available, otherwise use fallback
      const finalNewsData = transformedNews.length > 0 ? transformedNews : fallbackNewsData;
      setArticles(finalNewsData);
      setFilteredArticles(finalNewsData);
      
    } catch (error) {
      console.error('Error fetching news from backend:', error);
      // Use fallback data if API fails
      const fallbackNewsData = [
        {
          id: 1,
          title: "Ethiopian Coffee Exports Hit Record Highs in 2024",
          excerpt: "Coffee exports from Ethiopia reached unprecedented levels this quarter.",
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=250&fit=crop&crop=center",
          category: "market",
          author: "Dawit Negash",
          date: "2024-03-20",
          readTime: "5 min read",
          featured: true,
          tags: ["Export", "Coffee", "Market Analysis"],
          fullContent: "Ethiopian coffee exports have reached unprecedented levels in the first quarter of 2024."
        }
      ];
      setArticles(fallbackNewsData);
      setFilteredArticles(fallbackNewsData);
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, []);

  useEffect(() => {
    let filtered = articles;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6"
          >
            <motion.svg 
              className="w-5 h-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"></path>
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
            </motion.svg>
            Latest Agricultural News
          </motion.div>
          
          <h1 className="heading-lg text-gray-900 mb-6">
            Stay <span className="text-gradient">Informed</span> with Industry Insights
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get the latest news, market trends, and expert insights to stay ahead 
            in the ever-evolving agricultural landscape.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <motion.svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </motion.svg>
            <input
              type="text"
              placeholder="Search news articles, topics, or keywords..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-0 text-lg bg-white shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <span className={selectedCategory === category.id ? "text-white" : "text-green-600"}>
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
            />
            <p className="mt-4 text-gray-600 text-lg">Loading latest news...</p>
          </div>
        )}

        {/* Content */}
        <AnimatePresence>
          {!loading && (
            <>
              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <motion.svg 
                      className="w-6 h-6 mr-2 text-orange-500" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </motion.svg>
                    Featured Stories
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                              {categories.find(cat => cat.id === article.category)?.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-4">
                              <span>{article.author}</span>
                              <span>•</span>
                              <span>{formatDate(article.date)}</span>
                            </div>
                            <span>{article.readTime}</span>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-primary"
                          >
                            Read Full Article
                          </motion.button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Regular Articles */}
              {regularArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest News</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularArticles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                              {categories.find(cat => cat.id === article.category)?.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span>{article.author}</span>
                            <span>{article.readTime}</span>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-secondary border-green-300 text-green-700 hover:bg-green-50"
                          >
                            Read More
                          </motion.button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No Results */}
              {filteredArticles.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <motion.svg 
                    className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                  </motion.svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default News;
