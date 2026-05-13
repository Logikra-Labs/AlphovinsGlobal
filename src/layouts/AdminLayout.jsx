import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, FileText, BarChart3,
  Menu, X, User, Trash2, LogOut, ShoppingBag, MessageSquare, Package
} from 'lucide-react';
import { auth, isFirebaseConfigured } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LABELS } from '../utils/format';

const navItems = [
  { id: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/admin/new-sale', label: 'New Sale', icon: PlusCircle },
  { id: '/admin/history', label: 'Bill History', icon: FileText },
  { id: '/admin/online-orders', label: 'E-Commerce', icon: ShoppingBag },
  { id: '/admin/products', label: 'Products', icon: Package },
  { id: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: '/admin/insights', label: 'Insights', icon: FileText },
  { id: '/admin/sales-stats', label: 'Sales Stats', icon: BarChart3 },
  { id: '/admin/recycle-bin', label: 'Recycle Bin', icon: Trash2 },
];

function SidebarContent({ user, onLogout, onNavClick }) {
  return (
    <>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(22,101,52,0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.png" alt="Alphovins" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(34,197,94,0.3)' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#86efac', letterSpacing: '-0.02em' }}>ADMIN</div>
          <div style={{ fontSize: '10px', color: 'rgba(34,197,94,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portal</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.id}
            onClick={onNavClick}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s',
              background: isActive ? 'rgba(22,101,52,0.2)' : 'transparent',
              color: isActive ? '#86efac' : 'rgba(134,239,172,0.5)',
              border: isActive ? '1px solid rgba(22,101,52,0.4)' : '1px solid transparent',
            })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid rgba(22,101,52,0.3)' }}>
        {user && (
          <NavLink
            to="/admin/profile"
            onClick={onNavClick}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '4px',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              color: isActive ? '#86efac' : 'rgba(134,239,172,0.6)',
              background: isActive ? 'rgba(22,101,52,0.2)' : 'transparent',
            })}
          >
            <User size={20} />
            <span>Admin Profile</span>
          </NavLink>
        )}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            background: 'transparent',
            border: 'none',
            color: 'rgba(248,113,113,0.8)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'rgb(248,113,113)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.8)'; }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, (u) => setUser(u));
      return unsub;
    }
  }, []);

  const handleLogout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030f05' }}>

      {/* Desktop Sidebar — hidden on mobile, shown on lg+ screens via Tailwind */}
      <aside style={{
        width: '256px',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        flexDirection: 'column',
        background: 'rgba(5,46,22,0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(22,101,52,0.3)',
        zIndex: 50,
      }} className="hidden lg:flex">
        <SidebarContent user={user} onLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside style={{
        width: '256px',
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-256px',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(5,46,22,0.98)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(22,101,52,0.3)',
        zIndex: 50,
        transition: 'left 0.3s ease',
      }} className="lg:hidden">
        <SidebarContent user={user} onLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="lg:ml-64">

        {/* Mobile Top Bar */}
        <header className="lg:hidden" style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'rgba(5,46,22,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(22,101,52,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: '64px',
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#86efac', cursor: 'pointer', padding: '8px' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <NavLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Alphovins" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#86efac' }}>ADMIN PORTAL</span>
          </NavLink>
          <div style={{ width: '40px' }} /> {/* spacer to keep logo centered */}
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px 20px' }} className="lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
