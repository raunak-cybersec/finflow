import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LayoutDashboard, ArrowRightLeft, Target, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="main-layout">
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Mobile top bar */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(8,8,16,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px', zIndex: 100,
        alignItems: 'center', justifyContent: 'space-between',
      }} className="mobile-topbar">
        <span className="gradient-text font-heading" style={{ fontSize: 18, fontWeight: 700 }}>FinFlow</span>
        <button className="btn-icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <main className="main-content page-enter">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {[
          { to: '/', icon: LayoutDashboard, label: 'Home' },
          { to: '/transactions', icon: ArrowRightLeft, label: 'Txns' },
          { to: '/budgets', icon: Target, label: 'Budgets' },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '6px 16px', borderRadius: 8,
              color: isActive ? '#818cf8' : '#475569',
              textDecoration: 'none', fontSize: 10, fontWeight: 500,
              transition: 'color 0.2s ease',
            })}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
