import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, TrendingUp, ShieldCheck, Globe2, X } from 'lucide-react';
import { getInsights } from '../../services/insightService';

export default function Blog() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => { loadInsights(); }, []);

  const loadInsights = async () => {
    setLoading(true);
    const data = await getInsights();
    setInsights(data);
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="bg-[#F5F0E8] border-b border-[#E8E0D0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto slide-up">
          <p className="section-label mb-3">Market Insights</p>
          <h1 className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Stay Ahead of the <span className="gradient-text">Market</span>
          </h1>
          <p className="text-lg text-[#374151] max-w-xl leading-[1.7]">
            The latest trends in global agro-exports, logistics innovations, and sustainable farming practices.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            { icon: <TrendingUp size={20} />, label: 'Market Growth', value: '+14% YoY' },
            { icon: <Globe2 size={20} />, label: 'Active Regions', value: '25+ Countries' },
            { icon: <ShieldCheck size={20} />, label: 'Quality Assurance', value: 'ISO Certified' },
          ].map(stat => (
            <div key={stat.label} className="card p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981] shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B7280] font-display">{stat.label}</p>
                <p className="text-xl font-bold text-[#0A0A0A] font-display">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Articles */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-[#E8E0D0] border-t-[#10B981] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((post, index) => (
              <article
                key={post.id}
                className="card overflow-hidden group flex flex-col h-full slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="aspect-video bg-[#F5F0E8] flex items-center justify-center relative overflow-hidden shrink-0">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{post.image || '📊'}</span>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#10B981] text-white text-[10px] font-bold uppercase tracking-wider">
                    {post.category || 'Update'}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-[#9CA3AF] mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date || new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Admin'}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A0A0A] font-display mb-3 group-hover:text-[#10B981] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-[#374151] text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8E0D0]">
                    <span className="text-xs text-[#9CA3AF] font-medium">{post.readTime || '3 min read'}</span>
                    <button
                      onClick={() => setSelectedInsight(post)}
                      className="flex items-center gap-1.5 text-sm font-bold text-[#10B981] hover:text-[#059669] transition-colors font-display"
                    >
                      Read More <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {insights.length === 0 && (
              <div className="col-span-full text-center py-20 text-[#9CA3AF] text-lg border-2 border-dashed border-[#E8E0D0] rounded-[20px]">
                No insights available yet. Check back soon!
              </div>
            )}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-20 p-8 sm:p-12 rounded-[24px] bg-[#F5F0E8] border border-[#E8E0D0] relative overflow-hidden">
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-[200px] w-[200px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#0A0A0A] font-display mb-3">Stay Ahead of the Market</h2>
            <p className="text-[#374151] mb-8">Subscribe for exclusive insights into the global agro-export market and seasonal harvest updates.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input-field flex-1"
              />
              <button className="btn-primary btn-shine px-8 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm fade-in" onClick={() => setSelectedInsight(null)}>
          <div className="bg-white w-full max-w-3xl rounded-[24px] border border-[#E8E0D0] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col slide-up relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedInsight(null)}
              className="absolute right-5 top-5 p-2 text-[#6B7280] hover:text-[#0A0A0A] bg-[#F5F0E8] hover:bg-[#E8E0D0] rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="h-48 w-full bg-[#F5F0E8] flex items-center justify-center relative shrink-0">
              <span className="text-7xl">{selectedInsight.image || '📊'}</span>
              <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#10B981] text-white text-xs font-bold uppercase tracking-wider">
                {selectedInsight.category || 'Update'}
              </div>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] font-display mb-4 leading-tight">{selectedInsight.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280] mb-8 pb-6 border-b border-[#E8E0D0]">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {selectedInsight.date || new Date(selectedInsight.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><User size={14} /> {selectedInsight.author || 'Admin'}</span>
                <span className="flex items-center gap-1.5"><TrendingUp size={14} /> {selectedInsight.readTime || '3 min read'}</span>
              </div>
              <div>
                {selectedInsight.content?.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-[#374151] leading-[1.8] mb-4 text-base">{paragraph}</p>
                )) || <p className="text-[#374151] leading-[1.8]">{selectedInsight.excerpt}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
