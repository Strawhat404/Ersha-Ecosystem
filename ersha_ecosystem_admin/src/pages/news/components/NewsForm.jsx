import React from 'react';

const categories = [
  { id: 'market', name: 'Market Trends' },
  { id: 'technology', name: 'Farm Tech' },
  { id: 'climate', name: 'Weather & Climate' },
  { id: 'policy', name: 'Policy & Regulations' },
];


const NewsForm = ({ form, onChange, onSubmit, editingId }) => (
  <form onSubmit={(e) => {
    console.log('Form onSubmit triggered!'); // Debug log
    onSubmit(e);
  }} className="bg-white rounded-xl shadow p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block font-medium mb-1">Title</label>
      <input name="title" value={form.title} onChange={onChange} required className="w-full border rounded px-3 py-2 mb-3" />
      <label className="block font-medium mb-1">Image URL</label>
      <input name="image_url" value={form.image_url} onChange={onChange} required className="w-full border rounded px-3 py-2 mb-3" />
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
      <label className="block font-medium mb-1">Article Content</label>
      <textarea name="content" value={form.content} onChange={onChange} required rows={10} className="w-full border rounded px-3 py-2 mb-3 min-h-[250px]" placeholder="Enter the full article content here..." />
    </div>
    <div className="md:col-span-2">
      <label className="block font-medium mb-1">Brief Summary (Optional)</label>
      <textarea name="excerpt" value={form.excerpt} onChange={onChange} rows={3} className="w-full border rounded px-3 py-2 mb-3 min-h-[80px]" placeholder="Enter a brief summary (optional - will be auto-generated from content if left empty)..." />
      <p className="text-sm text-gray-500">Leave empty to auto-generate from the content above</p>
    </div>
  </form>
);

export default NewsForm;
