import React, { useState, useEffect } from 'react';
import { newsAPI } from '../lib/api';

const initialNews = [
  {
    id: 1,
    title: 'Market Prices Surge in July',
    excerpt: 'Grain and vegetable prices see a sharp increase due to weather conditions.',
    image: 'https://source.unsplash.com/featured/?farm,market',
    author: 'Admin',
    date: '2025-07-20',
    category: 'market',
    featured: true,
    readTime: '3 min read',
  },
  {
    id: 2,
    title: 'New Farm Tech Revolutionizes Harvest',
    excerpt: 'Innovative machinery boosts productivity for local farmers.',
    image: 'https://source.unsplash.com/featured/?farm,technology',
    author: 'Admin',
    date: '2025-07-15',
    category: 'technology',
    featured: false,
    readTime: '2 min read',
  },
  {
    id: 3,
    title: 'Weather Patterns Affect Crop Yields',
    excerpt: 'Unusual rainfall patterns impact this season’s harvest.',
    image: 'https://source.unsplash.com/featured/?farm,weather',
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
    excerpt: '',
    image: '',
    category: categories[0].id,
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
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

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage News</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div className="mb-4 text-gray-500">Loading...</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-medium mb-1">Excerpt</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required className="w-full border rounded px-3 py-2 mb-3" />
          <label className="block font-medium mb-1">Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} required className="w-full border rounded px-3 py-2 mb-3" />
        </div>
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-3">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 mb-3">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured
          </label>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
            {editingId ? 'Update News' : 'Add News'}
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            <img src={item.image} alt={item.title} className="h-40 w-full object-cover rounded mb-3" />
            <div className="flex-1">
              <h2 className="font-bold text-lg mb-1">{item.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
              <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">{categories.find(c => c.id === item.category)?.name}</span>
              {item.featured && <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded ml-2">Featured</span>}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(item)} className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;
