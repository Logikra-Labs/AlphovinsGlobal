import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../firebase';

export default function CustomerRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password should be at least 6 characters');
    setLoading(true);
    try {
      await register(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md slide-up">
        <div className="card p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E8E0D0] mx-auto mb-5 shadow-sm">
              <img src="/logo.png" alt="Alphovins" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] font-display mb-1">Create Account</h1>
            <p className="text-[#6B7280] text-sm">Join Alphovins for faster checkout</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-2 mb-6 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type="email" required={isFirebaseConfigured} value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-11" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type={showPassword ? 'text' : 'password'} required={isFirebaseConfigured} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-11 pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label-text">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type={showPassword ? 'text' : 'password'} required={isFirebaseConfigured} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pl-11" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-shine w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-[#E8E0D0]">
            <p className="text-[#6B7280] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#10B981] hover:text-[#059669] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
