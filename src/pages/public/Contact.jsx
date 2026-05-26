import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitInquiry } from '../../services/inquiryService';

export default function Contact() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'Bulk Order Inquiry', message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjectParam = params.get('subject');
    if (subjectParam) setFormData(prev => ({ ...prev, subject: subjectParam }));
  }, [location]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    const result = await submitInquiry(formData);
    if (result.success) {
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', phone: '', subject: 'Bulk Order Inquiry', message: '' });
    } else {
      setStatus({ loading: false, success: false, error: result.error });
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="bg-[#F5F0E8] border-b border-[#E8E0D0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto slide-up">
          <p className="section-label mb-3">Contact Us</p>
          <h1 className="font-display font-bold tracking-[-0.025em] text-[#0A0A0A] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-[#374151] max-w-xl leading-[1.7]">
            Questions about our varieties? Looking to place a bulk order? Send us a message and our team will respond promptly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info */}
          <div className="space-y-5 slide-up" style={{ animationDelay: '100ms' }}>
            <div className="card p-7">
              <h3 className="text-xl font-bold text-[#0A0A0A] font-display mb-7">Contact Information</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin size={20} />,
                    title: 'Our Location',
                    content: <>ALPHOVINS Global Agro Exports<br />12/141-12 Anandanadarkudi Road<br />Pampanvilai, Nagercoil<br />Kanyakumari, Tamil Nadu — 629201</>
                  },
                  {
                    icon: <Phone size={20} />,
                    title: 'Phone Number',
                    content: <a href="tel:+918925011054" className="hover:text-[#10B981] transition-colors">+91 89250 11054</a>
                  },
                  {
                    icon: <Mail size={20} />,
                    title: 'Email Address',
                    content: <a href="mailto:business.alphovins@gmail.com" className="hover:text-[#10B981] transition-colors">business.alphovins@gmail.com</a>
                  },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0A0A0A] font-display mb-1 text-sm">{item.title}</h4>
                      <p className="text-[#374151] text-sm leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bulk order CTA */}
            <div className="rounded-[20px] bg-[#10B981] p-6 text-white">
              <h4 className="font-bold font-display text-lg mb-2">Need a Bulk Quote?</h4>
              <p className="text-white/80 text-sm leading-relaxed">Fill in the form with your requirements and we'll send you a custom export price sheet.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 slide-up" style={{ animationDelay: '200ms' }}>
            <div className="card p-8 sm:p-10">
              {status.success ? (
                <div className="text-center py-14">
                  <div className="w-20 h-20 rounded-full bg-[#ECFDF5] border border-[rgba(16,185,129,0.25)] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={36} className="text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A0A0A] font-display mb-2">Message Sent!</h3>
                  <p className="text-[#374151] mb-8">Thank you for reaching out. We will get back to you shortly.</p>
                  <button
                    onClick={() => setStatus({ loading: false, success: false, error: null })}
                    className="btn-outline px-8 py-3"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-[#0A0A0A] font-display mb-6">Send us a Message</h2>

                  {status.error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-2 text-sm">
                      <AlertCircle size={18} /> {status.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-text">Your Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="label-text">Email Address</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-text">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
                    </div>
                    <div>
                      <label className="label-text">Subject</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} className="select-field">
                        <option>Bulk Order Inquiry</option>
                        <option>Sample Request</option>
                        <option>General Support</option>
                        <option>Partnership</option>
                        <option>Other</option>
                        {formData.subject && !['Bulk Order Inquiry', 'Sample Request', 'General Support', 'Partnership', 'Other'].includes(formData.subject) && (
                          <option value={formData.subject}>{formData.subject}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Message</label>
                    <textarea required name="message" value={formData.message} onChange={handleChange} className="input-field min-h-[140px] py-4" placeholder="How can we help you?" />
                  </div>

                  <button type="submit" disabled={status.loading} className="btn-primary btn-shine px-8 py-4 w-full sm:w-auto">
                    {status.loading ? 'Sending...' : (<><Send size={18} /> Send Message</>)}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
