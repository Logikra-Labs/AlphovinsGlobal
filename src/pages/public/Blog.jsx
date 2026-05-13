import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, TrendingUp, ShieldCheck, Globe2, X } from 'lucide-react';
import { getInsights } from '../../services/insightService';

export default function Blog() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    const data = await getInsights();
    setInsights(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16 slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-green-100 mb-6">
          Market <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Insights</span>
        </h1>
        <p className="text-lg text-gray-400">
          Stay updated with the latest trends in global agro-exports, logistics innovations, and sustainable farming practices.
        </p>
      </div>

      {/* Featured Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-green-950/20 border border-green-900/30 p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Market Growth</p>
            <p className="text-xl font-bold text-white">+14% YoY</p>
          </div>
        </div>
        <div className="bg-green-950/20 border border-green-900/30 p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
            <Globe2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Regions</p>
            <p className="text-xl font-bold text-white">25+ Countries</p>
          </div>
        </div>
        <div className="bg-green-950/20 border border-green-900/30 p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Quality Assurance</p>
            <p className="text-xl font-bold text-white">ISO Certified</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((post, index) => (
            <article 
              key={post.id} 
              className="group bg-[#030f05] rounded-3xl border border-green-900/30 overflow-hidden hover:border-green-500/50 transition-all duration-300 slide-up flex flex-col h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Post Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-green-900/40 to-emerald-900/20 flex items-center justify-center relative overflow-hidden shrink-0">
                <span className="text-6xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">{post.image || '📄'}</span>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-[#020a04] text-[10px] font-bold uppercase tracking-wider">
                  {post.category || 'Update'}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date || new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {post.author || 'Admin'}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-green-900/30">
                  <span className="text-xs text-green-500/60 font-medium">{post.readTime || '3 min read'}</span>
                  <button 
                    onClick={() => setSelectedInsight(post)}
                    className="flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors"
                  >
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {insights.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 text-lg border border-dashed border-green-900/30 rounded-3xl">
              No insights available at the moment. Please check back later!
            </div>
          )}
        </div>
      )}

      {/* Newsletter Section */}
      <div className="mt-20 p-8 sm:p-12 rounded-[2rem] bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Ahead of the Market</h2>
          <p className="text-gray-400 mb-8">Subscribe to our monthly newsletter for exclusive insights into the global agro-export market and seasonal harvest updates.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-green-500/50 transition-colors"
            />
            <button className="px-8 py-4 bg-green-500 hover:bg-green-400 text-[#020a04] font-bold rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Read More Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
          <div className="bg-[#020a04] w-full max-w-3xl rounded-[2rem] border border-green-900/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col slide-up relative">
            <button 
              onClick={() => setSelectedInsight(null)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors z-10 backdrop-blur-sm"
            >
              <X size={24} />
            </button>
            
            <div className="h-48 sm:h-64 w-full bg-gradient-to-br from-green-900/60 to-emerald-900/30 flex items-center justify-center relative shrink-0">
              <span className="text-8xl filter drop-shadow-2xl">{selectedInsight.image || '📄'}</span>
              <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-green-500 text-[#020a04] text-xs font-bold uppercase tracking-wider">
                {selectedInsight.category || 'Update'}
              </div>
            </div>
            
            <div className="p-6 sm:p-10 overflow-y-auto">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight">{selectedInsight.title}</h2>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-green-500/80 mb-8 pb-6 border-b border-green-900/30">
                <span className="flex items-center gap-2"><Calendar size={16} /> {selectedInsight.date || new Date(selectedInsight.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><User size={16} /> {selectedInsight.author || 'Admin'}</span>
                <span className="flex items-center gap-2"><TrendingUp size={16} /> {selectedInsight.readTime || '3 min read'}</span>
              </div>
              
              <div className="prose prose-invert prose-green max-w-none">
                {selectedInsight.content?.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-300 leading-relaxed mb-4 text-base sm:text-lg">
                    {paragraph}
                  </p>
                )) || <p className="text-gray-300 text-lg leading-relaxed">{selectedInsight.excerpt}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
