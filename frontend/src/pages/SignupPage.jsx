import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome to FinFlow 🎉');
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
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
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
          <p style={{ color: '#475569', fontSize: 15 }}>Take control of your finances today</p>
        </div>

        <div className="glass" style={{ padding: 32 }}>
          <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
            Create account
          </h2>
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 28 }}>
            Free forever. No credit card required.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Full name</label>
              <input
                id="signup-name"
                className="input"
                type="text"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                minLength={2}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Email address</label>
              <input
                id="signup-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  minLength={6}
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
              <p style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>
                We automatically seed sample transactions so your dashboard looks alive ✨
              </p>
            </div>

            <button
              id="signup-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Get started →'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', color: '#475569', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
