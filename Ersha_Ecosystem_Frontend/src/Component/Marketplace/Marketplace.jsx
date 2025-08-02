import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  Star,
  TrendingUp,
  ShoppingCart,
  Heart,
  Eye,
  ArrowUpDown,
  Users,
  Leaf,
  Shield,
  Truck,
  X,
  ChevronDown,
  Upload,
  Camera,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Filters from "./Filters";
import Products from "./Products";
import ProductCard from "./productCard";

const Marketplace = () => {
  // Use AuthContext for user authentication
  const { user, profile, loading: authLoading } = useAuth();
  // Use CartContext for cart functionality
  const { addToCart, cartSummary } = useCart();
  const navigate = useNavigate();
  
  // Add custom styles for scrollbar hiding
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Ensure proper layout and prevent overlap */
      .marketplace-layout {
        display: flex;
        flex-direction: column;
      }
      
      @media (min-width: 1024px) {
        .marketplace-layout {
          flex-direction: row;
        }
      }
      
      .sidebar-container {
        flex-shrink: 0;
      }
      
      .main-content {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [filters, setFilters] = useState({ 
    categories: [], 
    locations: [], 
    priceRange: [0, 1000],
    rating: 0,
    verified: false,
    freshness: 'all'
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Add mock data for farmer listings
  const [farmerListings, setFarmerListings] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add New Listing Popup State
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newListingForm, setNewListingForm] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category: '',
    location: '',
    organic: false,
    harvest_date: '',
    image: null,
    imagePreview: null
  });

  // Check if product is in cart
  const isProductInCart = (productId) => {
    return cartSummary.cartItems?.some(item => item.product === productId) || false;
  };

  // Get cart item quantity
  const getCartItemQuantity = (productId) => {
    const cartItem = cartSummary.cartItems?.find(item => item.product === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle add to cart
  const handleAddToCart = async (productId) => {
    setAddingToCart(productId);
    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        // Show success feedback with animation
        showSuccessMessage('Product added to cart successfully! 🛒');
        
        // Add a brief success animation to the cart icon
        const cartIcon = document.querySelector('[data-cart-icon]');
        if (cartIcon) {
          cartIcon.style.transform = 'scale(1.2)';
          setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
          }, 200);
        }
        
        // Add success animation to the product card
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
          productCard.style.transform = 'scale(1.02)';
          productCard.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          setTimeout(() => {
            productCard.style.transform = 'scale(1)';
            productCard.style.boxShadow = '';
          }, 300);
        }
      } else {
        showErrorMessage(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showErrorMessage('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  // Toast notification system
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showSuccessMessage = (message) => {
    setToast({ show: true, message, type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const showErrorMessage = (message) => {
    setToast({ show: true, message, type: 'error' });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };
  
  // Get user role from AuthContext and map to marketplace roles
  const userType = profile?.user_type || user?.user_type || null;
  const role = userType === 'buyer' || userType === 'agricultural_business' ? 'merchant' : userType;

  // API Base URL - adjust this to match your backend URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  
  // Fetch farmer's listings
  const fetchFarmerListings = async () => {
    if (role !== 'farmer') {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/products/my_products/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFarmerListings(data.results || data); // Handle both paginated and non-paginated responses
    } catch (err) {
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products for merchants
  const fetchAllProducts = async () => {
    if (role !== 'merchant') {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query parameters for filtering
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.organic !== null) params.append('organic', filters.organic);
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (sortBy !== 'relevance') {
        if (sortBy === 'price_low') params.append('ordering', 'price');
        else if (sortBy === 'price_high') params.append('ordering', '-price');
        else if (sortBy === 'newest') params.append('ordering', '-created_at');
        else if (sortBy === 'rating') params.append('ordering', '-rating');
      }

      const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllProducts(data.results || data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch farmer listings when component mounts and user is a farmer
  useEffect(() => {
    if (role === 'farmer' && !authLoading) {
      fetchFarmerListings();
    }
  }, [role, authLoading]);

  // Fetch all products when component mounts and user is a merchant
  useEffect(() => {
    if (role === 'merchant' && !authLoading) {
      fetchAllProducts();
    }
  }, [role, authLoading]);

  // Fetch products when filters change (for merchants)
  useEffect(() => {
    if (role === 'merchant' && !authLoading) {
      fetchAllProducts();
    }
  }, [searchQuery, sortBy, activeCategory, filters]);

  try {
  // Form handling functions
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewListingForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleFormChange = (field, value) => {
    setNewListingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

    const handleSubmitListing = async (e) => {
    e.preventDefault();
      
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Prepare form data for multipart/form-data (for image upload)
        const formData = new FormData();
        formData.append('name', newListingForm.title);
        formData.append('description', newListingForm.description);
        formData.append('price', newListingForm.price);
        formData.append('quantity', newListingForm.quantity);
        formData.append('unit', newListingForm.unit);
        formData.append('category', newListingForm.category);
        formData.append('harvest_date', newListingForm.harvest_date);
        formData.append('organic', newListingForm.organic);
        
        if (newListingForm.image) {
          formData.append('image', newListingForm.image);
        }

        const response = await fetch(`${API_BASE_URL}/products/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
        }

        const createdProduct = await response.json();

        // Update the local state immediately to show the new product
        setFarmerListings(prevListings => [createdProduct, ...prevListings]);

        // Close modal and reset form
    setShowAddListingModal(false);
    setNewListingForm({
      title: '',
      description: '',
      price: '',
          quantity: '',
          unit: 'kg',
          category: '',
      location: '',
          organic: false,
          harvest_date: '',
      image: null,
      imagePreview: null
    });

        // Show success message
        setSuccessMessage('Product listing created successfully!');
        setShowSuccessModal(true);

      } catch (err) {
        setError(err.message || 'Failed to create listing. Please try again.');
      } finally {
        setLoading(false);
      }
  };

  const closeModal = () => {
    setShowAddListingModal(false);
      setShowEditListingModal(false);
      setShowSuccessModal(false);
      setShowDeleteModal(false);
      setEditingProduct(null);
      setDeletingProduct(null);
    setNewListingForm({
      title: '',
      description: '',
      price: '',
        quantity: '',
        unit: 'kg',
        category: '',
      location: '',
        organic: false,
        harvest_date: '',
      image: null,
      imagePreview: null
    });
      setError(null);
    };

    // Confirm delete function
    const handleConfirmDelete = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_BASE_URL}/products/${deletingProduct}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
        }

        // Update the local state immediately to remove the deleted product
        setFarmerListings(prevListings => 
          prevListings.filter(listing => listing.id !== deletingProduct)
        );

        // Close delete modal
        setShowDeleteModal(false);
        setDeletingProduct(null);

        // Show success message
        setSuccessMessage('Product deleted successfully!');
        setShowSuccessModal(true);

      } catch (err) {
        setError(err.message || 'Failed to delete product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Delete product function
    const handleDeleteProduct = async (productId) => {
      setDeletingProduct(productId);
      setShowDeleteModal(true);
    };

    // Edit product function
    const handleEditProduct = (product) => {
      setEditingProduct(product);
      setNewListingForm({
        title: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        unit: product.unit,
        category: product.category || '',
        location: '',
        organic: product.organic,
        harvest_date: product.harvest_date,
        image: null,
        imagePreview: product.image || null
      });
      setShowEditListingModal(true);
    };

    // Update product function
    const handleUpdateProduct = async (e) => {
      e.preventDefault();
      
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Prepare form data for multipart/form-data (for image upload)
        const formData = new FormData();
        formData.append('name', newListingForm.title);
        formData.append('description', newListingForm.description);
        formData.append('price', newListingForm.price);
        formData.append('quantity', newListingForm.quantity);
        formData.append('unit', newListingForm.unit);
        formData.append('category', newListingForm.category);
        formData.append('harvest_date', newListingForm.harvest_date);
        formData.append('organic', newListingForm.organic);
        
        if (newListingForm.image && newListingForm.image instanceof File) {
          formData.append('image', newListingForm.image);
        }

        const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
        }

        const updatedProduct = await response.json();

        // Update the local state immediately to prevent the product from disappearing
        setFarmerListings(prevListings => 
          prevListings.map(listing => 
            listing.id === editingProduct.id ? updatedProduct : listing
          )
        );

        // Close modal and reset form
        setShowEditListingModal(false);
        setEditingProduct(null);
        setNewListingForm({
          title: '',
          description: '',
          price: '',
          quantity: '',
          unit: 'kg',
          category: '',
          location: '',
          organic: false,
          harvest_date: '',
          image: null,
          imagePreview: null
        });

        // Show success message
        setSuccessMessage('Product updated successfully!');
        setShowSuccessModal(true);

      } catch (err) {
        setError(err.message || 'Failed to update product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  const categories = [
      { id: "all", name: "All Products", icon: "🌾", count: 0 },
      { id: "vegetables", name: "Vegetables", icon: "🥬", count: 0 },
      { id: "fruits", name: "Fruits", icon: "🍎", count: 0 },
      { id: "grains", name: "Grains & Cereals", icon: "🌾", count: 0 },
      { id: "dairy", name: "Dairy Products", icon: "🥛", count: 0 },
      { id: "coffee", name: "Coffee & Tea", icon: "☕", count: 0 },
      { id: "spices", name: "Spices & Herbs", icon: "🌿", count: 0 },
      { id: "legumes", name: "Legumes", icon: "🫘", count: 0 },
      { id: "tubers", name: "Tubers & Roots", icon: "🥔", count: 0 },
      { id: "other", name: "Other", icon: "📦", count: 0 }
    ];

    const productCategories = [
      { value: "vegetables", label: "Vegetables", icon: "🥬" },
      { value: "fruits", label: "Fruits", icon: "🍎" },
      { value: "grains", label: "Grains & Cereals", icon: "🌾" },
      { value: "dairy", label: "Dairy Products", icon: "🥛" },
      { value: "coffee", label: "Coffee & Tea", icon: "☕" },
      { value: "spices", label: "Spices & Herbs", icon: "🌿" },
      { value: "legumes", label: "Legumes", icon: "🫘" },
      { value: "tubers", label: "Tubers & Roots", icon: "🥔" },
      { value: "other", label: "Other", icon: "📦" }
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Most Popular" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        {/* Loading State */}
        {authLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading marketplace...</p>
            </div>
          </div>
        )}

        {/* Not Authenticated State */}
        {!authLoading && !user && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
              <p className="text-gray-600 mb-6">Please log in to access the marketplace.</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {/* Main Content - Only show if authenticated */}
        {!authLoading && user && (
          <>
            {/* Toast Notification */}
            <AnimatePresence>
              {toast.show && (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 ${
                    toast.type === 'success' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {toast.type === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-medium">{toast.message}</span>
                  <button
                    onClick={() => setToast({ show: false, message: '', type: 'success' })}
                    className="ml-2 hover:opacity-80 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Cart Indicator */}
            {cartSummary.totalItems > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-6 right-6 z-40"
              >
                <motion.button
                  onClick={() => navigate('/cart')}
                  className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">View Cart</span>
                    <span className="text-xs opacity-90">{cartSummary.totalItems} items</span>
                  </div>
                  <motion.div
                    className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {cartSummary.totalItems}
                  </motion.div>
                </motion.button>
              </motion.div>
            )}

      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Cinematic Background - Agricultural Landscape */}
        <div className="absolute inset-0">
          {/* Primary Background - Agricultural Field */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(
                135deg,
                rgba(34, 197, 94, 0.9) 0%,
                rgba(16, 185, 129, 0.8) 25%,
                rgba(5, 150, 105, 0.7) 50%,
                rgba(6, 78, 59, 0.9) 100%
              ), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23064e3b' points='957,450 539,900 1396,900'/%3E%3Cpolygon fill='%23065f46' points='957,450 872.9,900 1396,900'/%3E%3Cpolygon fill='%23047857' points='-60,900 398,662 816,900'/%3E%3Cpolygon fill='%23059669' points='337,900 398,662 816,900'/%3E%3Cpolygon fill='%231203,546 1552,900 876,900'/%3E%3Cpolygon fill='%2314b8a6' points='1203,546 1552,900 1162,900'/%3E%3Cpolygon fill='%232dd4bf' points='641,695 886,900 367,900'/%3E%3Cpolygon fill='%235eead4' points='587,900 641,695 886,900'/%3E%3C/svg%3E")`
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
                opacity: 0.6
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
              <Leaf 
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
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              Agricultural <span className="text-green-200">Marketplace</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Connect directly with farmers and merchants. Trade quality produce at competitive prices with complete transparency.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
            >
              {[
                { icon: Users, label: "Active Farmers", value: "2,450+" },
                { icon: ShoppingCart, label: "Products Listed", value: "12,300+" },
                { icon: MapPin, label: "Regions Covered", value: "9" },
                { icon: Shield, label: "Verified Sellers", value: "98%" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 backdrop-blur-md">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/80 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar - Merchants Only */}
      {role === "merchant" && (
        <section className="py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search for products, farmers, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Filter Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm sm:text-base"
                  >
                    <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Filters</span>
                    <span className="sm:hidden">Filter</span>
                  </motion.button>

                  {/* Sort Options */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-gray-100 hover:bg-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl pr-10 focus:ring-2 focus:ring-green-500 text-sm sm:text-base w-full sm:w-auto"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                  </div>

                  {/* View Mode Toggles */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 sm:p-3 rounded-lg transition-colors ${
                        viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 sm:p-3 rounded-lg transition-colors ${
                        viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                      }`}
                    >
                      <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Navigation - Merchants Only */}
      {role === "merchant" && (
        <section className="py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                    activeCategory === category.id
                      ? "bg-green-100 text-green-700 shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="marketplace-layout gap-6 lg:gap-8">
            {/* Filters Sidebar - Only show for merchants */}
            {role === "merchant" && (
              <div className="sidebar-container lg:w-72 xl:w-80">
                <Filters 
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="main-content">
              {/* Role-specific header */}
              {role === "merchant" && (
                <div className="mb-6 sm:mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <div className="flex items-center justify-center">
                      <div className="px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium bg-blue-500 text-white shadow-lg">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Marketplace - Buy Products</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {role === "farmer" && (
                <div className="mb-6 sm:mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <div className="flex items-center justify-center">
                      <div className="px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium bg-green-500 text-white shadow-lg">
                        <div className="flex items-center space-x-2">
                          <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">My Product Listings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show content based on user role */}
              {!role && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Access Restricted</h3>
                    <p className="text-gray-600">Please log in to access the marketplace.</p>
                  </div>
                </div>
              )}

              {/* Merchant View - Buy Products */}
              {role === "merchant" && (
                <>
                  {/* Cart Summary Banner */}
                  {cartSummary.totalItems > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ShoppingCart className="w-6 h-6" />
                          <div>
                            <h3 className="font-semibold">Items in your cart</h3>
                            <p className="text-sm opacity-90">
                              {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'item' : 'items'} • ETB {cartSummary.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => navigate('/cart')}
                          className="px-4 py-2 bg-white text-green-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* All Products - Merchant View */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activeCategory === "all" ? "All Products" : categories.find(c => c.id === activeCategory)?.name}
                      </h2>
                      <div className="text-gray-600">
                        {loading ? "Loading..." : `Showing ${allProducts.length} products`}
                      </div>
                      </div>
                    </div>
                    
                  {/* Products Grid */}
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 text-red-600">
                      {error}
                    </div>
                  ) : allProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No products found. Try adjusting your filters or search terms.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {allProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                          data-product-id={product.id}
                        >
                          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-4xl sm:text-6xl">🌿</span>
                            )}
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {product.is_active ? "Available" : "Unavailable"}
                              </span>
                            </div>
                          </div>
                          <div className="p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{product.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4 space-y-2 sm:space-y-0">
                              <div className="text-gray-600 text-sm sm:text-base">
                                <p className="font-medium">Price: ETB {product.price}/{product.unit}</p>
                                <p>Stock: {product.quantity} {product.unit}</p>
                              </div>
                              <div className="text-gray-600 text-sm sm:text-base">
                                <p>Harvest: {new Date(product.harvest_date).toLocaleDateString()}</p>
                                <p>Organic: {product.organic ? "Yes" : "No"}</p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <span className="text-sm sm:text-base">{product.farmer?.region || "Location not set"}</span>
                              </div>
                              {product.organic && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="text-sm sm:text-base">Organic</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1 text-blue-600">
                                <span className="text-xs sm:text-sm font-medium capitalize">{product.category}</span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                              {isProductInCart(product.id) ? (
                                <div className="flex flex-col space-y-2">
                                  <div className="text-center text-sm text-green-600 font-medium">
                                    ✓ In Cart ({getCartItemQuantity(product.id)} {product.unit})
                                  </div>
                                  <motion.button 
                                    className="w-full px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleAddToCart(product.id)}
                                    disabled={addingToCart === product.id}
                                    whileHover={addingToCart !== product.id ? { scale: 1.02, y: -1 } : {}}
                                    whileTap={addingToCart !== product.id ? { scale: 0.98 } : {}}
                                  >
                                    {addingToCart === product.id ? (
                                      <>
                                        <motion.div 
                                          className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <span>Adding...</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Add More</span>
                                      </>
                                    )}
                                  </motion.button>
                                </div>
                              ) : (
                                <motion.button 
                                  className={`w-full px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2 ${
                                    addingToCart === product.id
                                      ? 'bg-green-600 text-white shadow-lg'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  onClick={() => handleAddToCart(product.id)}
                                  disabled={addingToCart === product.id}
                                  whileHover={addingToCart !== product.id ? { scale: 1.02, y: -1 } : {}}
                                  whileTap={addingToCart !== product.id ? { scale: 0.98 } : {}}
                                >
                                  {addingToCart === product.id ? (
                                    <>
                                      <motion.div 
                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      />
                                      <span>Adding...</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="w-4 h-4" />
                                      <span>Add to Cart</span>
                                    </>
                                  )}
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Farmer View - Sell Products */}
              {role === "farmer" && (
                /* Farmer View: My Listings */
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Product Listings</h2>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddListingModal(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium flex items-center space-x-2 hover:bg-green-700 transition-colors"
                    >
                      <Leaf className="w-5 h-5" />
                      <span>Add New Listing</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {loading ? (
                        <div className="text-center py-12">
                          <p>Loading your listings...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-12 text-red-600">
                          {error}
                        </div>
                      ) : farmerListings.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          You haven't listed any products yet. Click "Add New Listing" to start.
                        </div>
                      ) : (
                        farmerListings.map((listing, index) => (
                      <motion.div
                            key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                              {listing.image ? (
                                <img 
                                  src={listing.image} 
                                  alt={listing.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-4xl sm:text-6xl">🌿</span>
                              )}
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                  listing.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                  {listing.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{listing.name}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{listing.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4 space-y-2 sm:space-y-0">
                            <div className="text-gray-600 text-sm sm:text-base">
                                  <p className="font-medium">Price: ETB {listing.price}/{listing.unit}</p>
                                  <p>Stock: {listing.quantity} {listing.unit}</p>
                            </div>
                            <div className="text-gray-600 text-sm sm:text-base">
                                  <p>Harvest: {new Date(listing.harvest_date).toLocaleDateString()}</p>
                                  <p>Organic: {listing.organic ? "Yes" : "No"}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                  <span className="text-sm sm:text-base">{listing.farmer?.region || "Location not set"}</span>
                            </div>
                                {listing.organic && (
                              <div className="flex items-center space-x-1 text-green-600">
                                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-sm sm:text-base">Organic</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <button 
                                  onClick={() => handleEditProduct(listing)}
                                  className="flex-1 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors text-sm sm:text-base"
                                >
                              Edit Listing
                            </button>
                                <button 
                                  onClick={() => handleDeleteProduct(listing.id)}
                                  className="px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors text-sm sm:text-base"
                                >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                        ))
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Add New Listing Modal */}
      <AnimatePresence>
        {showAddListingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Product Listing</h2>
                    <p className="text-gray-600">Share your quality produce with buyers</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmitListing} className="p-6 space-y-6">
                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                      Product Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors cursor-pointer group"
                    >
                      {newListingForm.imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={newListingForm.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <div className="text-white text-center">
                              <Camera className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Change Image</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-green-600 transition-colors">
                          <Upload className="w-12 h-12 mb-3" />
                          <p className="text-lg font-medium">Upload Product Image</p>
                          <p className="text-sm">Click to browse or drag and drop</p>
                          <p className="text-xs mt-1">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Product Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={newListingForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="e.g., Fresh Organic Tomatoes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    value={newListingForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Describe your product quality, farming methods, harvest date, etc."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                  {/* Product Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Category *
                    </label>
                    <select
                      value={newListingForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {productCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price and Quantity Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Price per unit *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newListingForm.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                    {/* Quantity */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Available Quantity *
                      </label>
                      <input
                        type="number"
                        value={newListingForm.quantity}
                        onChange={(e) => handleFormChange('quantity', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Unit and Harvest Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Unit */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit *
                      </label>
                      <select
                        value={newListingForm.unit}
                        onChange={(e) => handleFormChange('unit', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ton">Ton</option>
                        <option value="quintal">Quintal</option>
                        <option value="liter">Liter</option>
                        <option value="piece">Piece</option>
                        <option value="bundle">Bundle</option>
                      </select>
                    </div>

                    {/* Harvest Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Harvest Date *
                      </label>
                      <input
                        type="date"
                        value={newListingForm.harvest_date}
                        onChange={(e) => handleFormChange('harvest_date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Organic Checkbox */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newListingForm.organic}
                        onChange={(e) => handleFormChange('organic', e.target.checked)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">This is an organic product</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      disabled={loading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-5 h-5" />
                          <span>Create Listing</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Listing Modal */}
        <AnimatePresence>
          {showEditListingModal && editingProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Edit Product Listing</h2>
                      <p className="text-gray-600">Update your product information</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleUpdateProduct} className="p-6 space-y-6">
                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="edit-image-upload"
                      />
                      <label
                        htmlFor="edit-image-upload"
                        className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer group"
                      >
                        {newListingForm.imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={newListingForm.imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                              <div className="text-white text-center">
                                <Camera className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Change Image</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-blue-600 transition-colors">
                            <Upload className="w-12 h-12 mb-3" />
                            <p className="text-lg font-medium">Upload Product Image</p>
                            <p className="text-sm">Click to browse or drag and drop</p>
                            <p className="text-xs mt-1">PNG, JPG, JPEG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Product Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Title *
                    </label>
                      <input
                        type="text"
                      value={newListingForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="e.g., Fresh Organic Tomatoes"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      value={newListingForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe your product quality, farming methods, harvest date, etc."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Product Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Category *
                    </label>
                    <select
                      value={newListingForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a category</option>
                      {productCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price and Quantity Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Price per unit *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={newListingForm.price}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Available Quantity *
                      </label>
                      <input
                        type="number"
                        value={newListingForm.quantity}
                        onChange={(e) => handleFormChange('quantity', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Unit and Harvest Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Unit */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit *
                      </label>
                      <select
                        value={newListingForm.unit}
                        onChange={(e) => handleFormChange('unit', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ton">Ton</option>
                        <option value="quintal">Quintal</option>
                        <option value="liter">Liter</option>
                        <option value="piece">Piece</option>
                        <option value="bundle">Bundle</option>
                      </select>
                    </div>

                    {/* Harvest Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Harvest Date *
                      </label>
                      <input
                        type="date"
                        value={newListingForm.harvest_date}
                        onChange={(e) => handleFormChange('harvest_date', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Organic Checkbox */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newListingForm.organic}
                        onChange={(e) => handleFormChange('organic', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">This is an organic product</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeModal}
                      disabled={loading}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                    <Package className="w-5 h-5" />
                          <span>Update Listing</span>
                        </>
                      )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                  <p className="text-gray-600 mb-6">{successMessage}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSuccessModal(false)}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    OK
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && deletingProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-10 h-10 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
                  <p className="text-gray-600 mb-6">Are you sure you want to delete this product listing?</p>
                  <div className="flex justify-center space-x-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmDelete}
                      disabled={loading}
                      className="px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5" />
                          <span>Delete</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}
    </div>
  );
  } catch (error) {
    console.error("An error occurred during Marketplace component rendering:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">Failed to load the marketplace. Please try again later.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
};

export default Marketplace;