import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#080810',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 0 40px rgba(129,140,248,0.3)',
          }}>
            <TrendingUp size={28} color="white" />
          </div>
          <h1 className="font-heading gradient-text" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            FinFlow
          </h1>
          <p style={{ color: '#475569', fontSize: 15 }}>Your personal finance command center</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: 32 }}>
          <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 28 }}>Sign in to your account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>
                Email address
              </label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#475569',
                    cursor: 'pointer', padding: 0, display: 'flex',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', color: '#475569', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
