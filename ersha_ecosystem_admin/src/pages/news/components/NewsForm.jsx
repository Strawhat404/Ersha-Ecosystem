import React from 'react';

const categories = [
  { id: 'market', name: 'Market Trends' },
  { id: 'technology', name: 'Farm Tech' },
  { id: 'climate', name: 'Weather & Climate' },
  { id: 'policy', name: 'Policy & Regulations' },
];


const NewsForm = ({ form, onChange, onSubmit, editingId }) => (
  <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block font-medium mb-1">Title</label>
      <input name="title" value={form.title} onChange={onChange} required className="w-full border rounded px-3 py-2 mb-3" />
      <label className="block font-medium mb-1">Image URL</label>
      <input name="image" value={form.image} onChange={onChange} required className="w-full border rounded px-3 py-2 mb-3" />
    </div>
    <div>
      <label className="block font-medium mb-1">Category</label>
      <select name="category" value={form.category} onChange={onChange} className="w-full border rounded px-3 py-2 mb-3">
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <label className="flex items-center gap-2 mb-3">
        <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} />
        Featured
      </label>
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
        {editingId ? 'Update News' : 'Add News'}
      </button>
    </div>
    <div className="md:col-span-2">
      <label className="block font-medium mb-1">Excerpt</label>
      <textarea name="excerpt" value={form.excerpt} onChange={onChange} required rows={6} className="w-full border rounded px-3 py-2 mb-3 min-h-[120px]" />
    </div>
  </form>
);

export default NewsForm;
