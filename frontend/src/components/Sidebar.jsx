import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowRightLeft, Target, LogOut, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { to: '/budgets', label: 'Budgets', icon: Target },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18
            }}>
              <TrendingUp size={18} color="white" />
            </div>
            <span className="gradient-text font-heading" style={{ fontSize: 20, fontWeight: 700 }}>
              FinFlow
            </span>
          </div>
        </div>

        {/* User pill */}
        <div style={{
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 24,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 6,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{user?.name}</p>
          <p style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{user?.email}</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 11, color: '#334155', fontWeight: 600, padding: '0 14px', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button className="sidebar-link btn-danger" onClick={handleLogout} style={{ width: '100%', marginTop: 16, border: 'none', background: 'rgba(248,113,113,0.08)', color: '#f87171' }}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
