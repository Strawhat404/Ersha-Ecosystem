import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../lib/api';
import NewsForm from './components/NewsForm';
import NewsCard from './components/NewsCard';

// Removed initialNews, will fetch from backend

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
    excerpt: '',
    image: '',
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
        setError('Failed to fetch news.');
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
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        // Update existing news
        await newsAPI.updateNews(editingId, form);
      } else {
        // Create new news
        await newsAPI.createNews(form);
      }
      // Refresh news list
      const data = await newsAPI.getNews();
      setNews(data);
      setEditingId(null);
      setForm({ title: '', excerpt: '', image: '', category: categories[0].id, featured: false });
      setShowForm(false);
    } catch (err) {
      setError('Failed to save news.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      image: item.image,
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
    setForm({ title: '', excerpt: '', image: '', category: categories[0].id, featured: false });
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
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div className="mb-4 text-gray-500">Loading...</div>}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            <NewsForm form={form} onChange={handleChange} onSubmit={handleSubmit} editingId={editingId} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default AdminNews;
