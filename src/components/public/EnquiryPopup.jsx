import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitInquiry } from '../../services/inquiryService';

export default function EnquiryPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [hasClosedOnCurrentPage, setHasClosedOnCurrentPage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Quick Enquiry',
    message: ''
  });
  
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  // Trigger popup when location changes
  useEffect(() => {
    // Only show popup on Home ('/') and Insights ('/blog')
    if (location.pathname !== '/' && location.pathname !== '/blog') {
      setIsOpen(false);
      return;
    }

    // Wait a brief moment before showing the popup so the page can load first
    setHasClosedOnCurrentPage(false);
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500); // 1.5 second delay

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    setHasClosedOnCurrentPage(true);
    // Optional: reset form state when closing
    if (status.success) {
      setStatus({ loading: false, success: false, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Quick Enquiry',
        message: ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    
    const result = await submitInquiry(formData);
    
    if (result.success) {
      setStatus({ loading: false, success: true, error: null });
      // Close automatically after 3 seconds on success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } else {
      setStatus({ loading: false, success: false, error: result.error });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#E8E0D0] shadow-2xl shadow-black/10 slide-up z-10">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-[#6B7280] hover:text-[#0A0A0A] bg-[#F5F0E8] hover:bg-[#E8E0D0] rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {status.success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-[#10B981]" />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] font-display mb-2">Message Sent!</h3>
            <p className="text-[#6B7280] text-sm font-sans">Thank you for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#0A0A0A] font-display mb-2">Have a Question?</h2>
              <p className="text-sm text-[#6B7280] font-sans">Send us a quick message and we'll help you out.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {status.error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {status.error}
                </div>
              )}

              <div>
                <input 
                  required 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="input-field w-full text-sm py-2.5" 
                  placeholder="Your Name" 
                />
              </div>
              
              <div>
                <input 
                  required 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="input-field w-full text-sm py-2.5" 
                  placeholder="Email Address" 
                />
              </div>

              <div>
                <textarea 
                  required 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="input-field w-full min-h-[100px] text-sm py-2.5" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status.loading}
                className="w-full btn-primary btn-shine flex items-center justify-center gap-2"
              >
                {status.loading ? 'Sending...' : (
                  <>
                    <Send size={18} />
                    Submit Enquiry
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
