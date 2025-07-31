import React, { useState } from 'react';
import NewsForm from './components/NewsForm';
import NewsCard from './components/NewsCard';

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
  const [news, setNews] = useState(initialNews);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    image: '',
    category: categories[0].id,
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setNews((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
      setEditingId(null);
    } else {
      setNews((prev) => [
        {
          ...form,
          id: Date.now(),
          author: 'Admin',
          date: new Date().toISOString().slice(0, 10),
          readTime: '2 min read',
        },
        ...prev,
      ]);
    }
    setForm({ title: '', excerpt: '', image: '', category: categories[0].id, featured: false });
    setShowForm(false);
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

  const handleDelete = (id) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
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
