import React from 'react';

const categories = [
  { id: 'market', name: 'Market Trends' },
  { id: 'technology', name: 'Farm Tech' },
  { id: 'climate', name: 'Weather & Climate' },
  { id: 'policy', name: 'Policy & Regulations' },
];

const NewsCard = ({ item, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col">
    <img src={item.image} alt={item.title} className="h-40 w-full object-cover rounded mb-3" />
    <div className="flex-1">
      <h2 className="font-bold text-lg mb-1">{item.title}</h2>
      <p className="text-gray-600 text-sm mb-2">{item.excerpt}</p>
      <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mb-2">{categories.find(c => c.id === item.category)?.name}</span>
      {item.featured && <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded ml-2">Featured</span>}
    </div>
    <div className="flex gap-2 mt-3">
      <button onClick={() => onEdit(item)} className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600">Edit</button>
      <button onClick={() => onDelete(item.id)} className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600">Delete</button>
    </div>
  </div>
);

export default NewsCard;
