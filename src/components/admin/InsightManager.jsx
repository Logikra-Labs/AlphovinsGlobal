import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { getInsights, addInsight, updateInsight, deleteInsight } from '../../services/insightService';

export default function InsightManager() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Alpha Admin',
    category: 'Market Trends',
    image: '🍌',
    readTime: '5 min read'
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    const data = await getInsights();
    setInsights(data);
    setLoading(false);
  };

  const handleOpenModal = (insight = null) => {
    if (insight) {
      setEditingId(insight.id);
      setFormData(insight);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: 'Alpha Admin',
        category: 'Market Trends',
        image: '🍌',
        readTime: '5 min read',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateInsight(editingId, formData);
    } else {
      await addInsight(formData);
    }
    handleCloseModal();
    loadInsights();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this insight?")) {
      await deleteInsight(id);
      loadInsights();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Market Insights Manager</h2>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Insight
        </button>
      </div>

      {loading ? (
        <div className="text-center text-green-500 py-10">Loading insights...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map(insight => (
            <div key={insight.id} className="bg-[#030f05] rounded-2xl border border-green-900/30 p-5 group hover:border-green-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{insight.image}</div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(insight)} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(insight.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-white mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{insight.excerpt}</p>
            </div>
          ))}
          {insights.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No insights published yet. Click "New Insight" to get started.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#020a04] w-full max-w-2xl rounded-3xl border border-green-900/50 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Insight' : 'New Insight'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <input required type="text" name="category" value={formData.category} onChange={handleChange} className="input-field w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Short Excerpt (shows on card)</label>
                <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} className="input-field w-full h-20"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Content (shows on Read More)</label>
                <textarea required name="content" value={formData.content} onChange={handleChange} className="input-field w-full h-40"></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Author</label>
                  <input required type="text" name="author" value={formData.author} onChange={handleChange} className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Emoji Icon</label>
                  <input required type="text" name="image" value={formData.image} onChange={handleChange} className="input-field w-full text-center" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Read Time</label>
                  <input required type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="input-field w-full" placeholder="e.g. 5 min read" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-green-900/30">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save Changes' : 'Publish Insight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
