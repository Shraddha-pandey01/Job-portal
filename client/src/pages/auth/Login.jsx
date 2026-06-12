import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const { role } = await loginUser(formData.email, formData.password);
      
      if (role === 'jobseeker') {
        navigate('/jobseeker/dashboard');
      } else {
        navigate('/employer/dashboard');
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMsg(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side: Illustration with Blue Overlay */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, var(--primary-main) 0%, var(--primary-dark) 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '500px', height: '500px', background: 'var(--secondary-main)',
          borderRadius: '50%', filter: 'blur(150px)', zIndex: 0, opacity: 0.5
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
          <Briefcase size={80} style={{ marginBottom: '24px', opacity: 0.9 }} />
          <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>
            Welcome back to Jobelia.
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.6 }}>
            Sign in to continue your journey and explore new opportunities.
          </p>
        </div>
      </div>

      {/* Right side: Form Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'var(--bg-color-light)'
      }}>
        <div className="glass-panel animate-slide-up" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          background: 'white', 
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Login to your account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            
            {errorMsg && (
              <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group delay-100 animate-slide-up">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-glass" 
                  style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.8)' }} 
                  placeholder="you@example.com" 
                  required 
                />
              </div>
            </div>

            <div className="form-group delay-200 animate-slide-up">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-glass" 
                  style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.8)' }} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="btn-primary delay-300 animate-slide-up" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
              {isLoading ? 'Loging in...' : 'Login'}
            </button>
          </form>

          <p className="delay-400 animate-slide-up" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-main)', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
