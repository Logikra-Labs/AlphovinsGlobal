import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, FileText, BarChart3, Menu, X, User, Trash2, LogOut
} from 'lucide-react';
import { auth, isFirebaseConfigured } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LABELS } from '../utils/format';
import { ShoppingBag, MessageSquare, Package } from 'lucide-react';

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, (u) => setUser(u));
      return unsub;
    }
  }, []);

  const navItems = [
    { id: '/admin/dashboard', label: LABELS.dashboard.en, tamil: LABELS.dashboard.ta, icon: LayoutDashboard },
    { id: '/admin/new-sale', label: LABELS.newSale.en, tamil: LABELS.newSale.ta, icon: PlusCircle },
    { id: '/admin/history', label: LABELS.billHistory.en, tamil: LABELS.billHistory.ta, icon: FileText },
    { id: '/admin/online-orders', label: 'E-Commerce', tamil: 'ஆன்லைன்', icon: ShoppingBag },
    { id: '/admin/products', label: 'Products', tamil: 'பொருட்கள்', icon: Package },
    { id: '/admin/inquiries', label: 'Inquiries', tamil: 'விசாரணை', icon: MessageSquare },
    { id: '/admin/insights', label: 'Insights', tamil: 'செய்திகள்', icon: FileText },
    { id: '/admin/sales-stats', label: LABELS.salesStats.en, tamil: LABELS.salesStats.ta, icon: BarChart3 },
    { id: '/admin/recycle-bin', label: 'Recycle Bin', tamil: 'குப்பை', icon: Trash2 },
  ];

  const handleLogout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#030f05] flex">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-green-950/80 backdrop-blur-xl border-r border-green-800/30 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-green-800/30">
          <img src="/logo.png" alt="Alphovins" className="w-12 h-12 rounded-full object-cover border-2 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-green-300">ADMIN</span>
            <span className="text-[10px] text-green-500/60 uppercase tracking-widest">Portal</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {navItems.map(item => (
            <NavLink
              key={item.id}
              to={item.id}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-green-600/20 text-green-300 border border-green-600/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                  : 'text-green-400/60 hover:text-green-300 hover:bg-green-900/30 border border-transparent'
              }`}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-[10px] text-green-600/50 hidden group-hover:block transition-all">{item.tamil}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-green-800/30 space-y-2">
          {user && (
            <NavLink 
              to="/admin/profile"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-green-600/20 text-green-300 border border-green-600/30' 
                  : 'text-green-500/70 hover:bg-green-900/40 hover:text-green-300 border border-transparent'
              }`}
            >
              <User size={20} />
              <span>Admin Profile</span>
            </NavLink>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-green-950/90 backdrop-blur-xl border-b border-green-800/30">
        <div className="flex items-center justify-between px-4 h-16">
          <NavLink to="/admin/dashboard" className="flex items-center gap-3">
            <img src="/logo.png" alt="Alphovins" className="w-8 h-8 rounded-full object-cover border-2 border-green-500/30" />
            <span className="font-bold text-sm tracking-tight text-green-300">ADMIN PORTAL</span>
          </NavLink>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-green-400 hover:bg-green-900/30 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 border-b border-green-800/30 bg-green-950/95 backdrop-blur-xl shadow-2xl slide-up max-h-[80vh] overflow-y-auto">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map(item => (
                <NavLink
                  key={item.id}
                  to={item.id}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-green-600/20 text-green-300 border border-green-600/30'
                      : 'text-green-400/60 hover:text-green-300 hover:bg-green-900/30'
                  }`}
                >
                  <item.icon size={20} />
                  <div>
                    <span className="block font-medium">{item.label}</span>
                    <span className="block text-xs text-green-600/50">{item.tamil}</span>
                  </div>
                </NavLink>
              ))}
              
              <div className="h-px bg-green-800/30 my-4"></div>

              {user && (
                 <NavLink
                  to="/admin/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-400/60 hover:text-green-300 hover:bg-green-900/30 transition-all"
                >
                  <User size={20} />
                  <span className="font-medium">Profile Settings</span>
                </NavLink>
              )}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-green-950/95 backdrop-blur-xl border-t border-green-800/30 safe-bottom">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.slice(0, 5).map(item => (
            <NavLink
              key={item.id}
              to={item.id}
              className={({ isActive }) => `flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl transition-all min-w-[60px] ${
                isActive ? 'text-green-400' : 'text-green-600/50 hover:text-green-500/80'
              }`}
            >
              <item.icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''} />
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="lg:hidden h-20" />
    </div>
  );
}
