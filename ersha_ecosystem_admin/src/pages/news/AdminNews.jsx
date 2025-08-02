import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../lib/api';
import NewsForm from './components/NewsForm';
import NewsCard from './components/NewsCard';

// Fallback data in case API fails
const initialNews = [
  {
    id: 1,
    title: 'Market Prices Surge in July',
    content: 'Grain and vegetable prices see a sharp increase due to weather conditions. This surge is attributed to several factors including improved quality control measures, favorable weather conditions, and increased international demand for specialty Ethiopian agricultural products.',
    excerpt: 'Grain and vegetable prices see a sharp increase due to weather conditions.',
    image_url: 'https://source.unsplash.com/featured/?farm,market',
    author: 'Admin',
    date: '2025-07-20',
    category: 'market',
    featured: true,
    readTime: '3 min read',
  },
  {
    id: 2,
    title: 'New Farm Tech Revolutionizes Harvest',
    content: 'Innovative machinery boosts productivity for local farmers. Agricultural technology is revolutionizing farming practices across Ethiopia with the introduction of advanced systems that help farmers monitor crop health, detect pest infestations early, and optimize irrigation patterns.',
    excerpt: 'Innovative machinery boosts productivity for local farmers.',
    image_url: 'https://source.unsplash.com/featured/?farm,technology',
    author: 'Admin',
    date: '2025-07-15',
    category: 'technology',
    featured: false,
    readTime: '2 min read',
  },
  {
    id: 3,
    title: 'Weather Patterns Affect Crop Yields',
    content: 'Unusual rainfall patterns impact this season\'s harvest. As climate change continues to pose challenges to agricultural productivity in Ethiopia, researchers and farmers are developing innovative adaptation strategies to maintain agricultural productivity.',
    excerpt: 'Unusual rainfall patterns impact this season\'s harvest.',
    image_url: 'https://source.unsplash.com/featured/?farm,weather',
    author: 'Admin',
    date: '2025-07-10',
    category: 'climate',
    featured: false,
    readTime: '4 min read',
  },
];

const categories = [
  { id: 'market', name: 'Market Trends' },
  { id: 'technology', name: 'Farm Tech' },
  { id: 'climate', name: 'Weather & Climate' },
  { id: 'policy', name: 'Policy & Regulations' },
];


const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    category: categories[0].id,
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch news from backend on mount
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await newsAPI.getNews();
        setNews(data);
      } catch (err) {
        setError('Failed to fetch news from API. Showing sample data.');
        // Fallback to initialNews if API fails
        setNews(initialNews);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!'); // Debug log
    
    // Auto-generate excerpt if empty
    const formData = { ...form };
    if (!formData.excerpt.trim() && formData.content.trim()) {
      formData.excerpt = formData.content.substring(0, 200) + (formData.content.length > 200 ? '...' : '');
    }
    
    console.log('Form data to submit:', formData); // Debug log
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        // Update existing news
        console.log('Updating news...'); // Debug log
        await newsAPI.updateNews(editingId, formData);
      } else {
        // Create new news
        console.log('Creating new news...'); // Debug log
        await newsAPI.createNews(formData);
      }
      // Refresh news list
      console.log('Success! Refreshing news list...'); // Debug log
      const data = await newsAPI.getNews();
      setNews(data);
      setEditingId(null);
      setForm({ title: '', content: '', excerpt: '', image_url: '', category: categories[0].id, featured: false });
      setShowForm(false);
      console.log('Form closed and reset!'); // Debug log
    } catch (err) {
      console.error('Error in handleSubmit:', err); // Debug log
      setError('Failed to save news: ' + err.message);
    } finally {
      setLoading(false);
      console.log('Loading set to false'); // Debug log
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content || '',
      excerpt: item.excerpt,
      image_url: item.image_url || item.image || '',
      category: item.category,
      featured: item.featured,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await newsAPI.deleteNews(id);
      const data = await newsAPI.getNews();
      setNews(data);
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError('Failed to delete news.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setForm({ title: '', content: '', excerpt: '', image_url: '', category: categories[0].id, featured: false });
    setEditingId(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
        <span>Manage News</span>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-1.5 rounded-lg font-semibold shadow-sm hover:from-green-600 hover:to-green-700 transition text-base min-w-[120px]"
        >
          Add News
        </button>
      </h1>
      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {loading && <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">Loading news articles...</div>}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            <NewsForm form={form} onChange={handleChange} onSubmit={handleSubmit} editingId={editingId} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No news articles found. {loading ? 'Loading...' : 'Add some news articles to get started.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;
