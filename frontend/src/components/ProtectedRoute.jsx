import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080810' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(129,140,248,0.2)',
            borderTopColor: '#818cf8',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Loading FinFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
