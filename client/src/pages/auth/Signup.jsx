import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { loginUser, updateUserProfile } = useAuth();
  
  const [role, setRole] = useState('jobseeker');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // 1. Register the core user schema
      await api.post('/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role
      });
      
      // 2. Auto-login immediately to obtain tokens and context setup
      await loginUser(formData.email, formData.password);
      
      // 3. If employer, natively push the companyName patch update
      if (role === 'employer' && formData.companyName) {
        await updateUserProfile({ companyName: formData.companyName });
      }
      
      // 4. Send to profile config map
      navigate('/profile');
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
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
            Start your journey with us.
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.8, lineHeight: 1.6 }}>
            Join the premier platform connecting top talent with industry-leading companies.
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
          maxWidth: '500px',
          padding: '40px',
          background: 'white',
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-dark)' }}>
              {role === 'employer' ? 'Employer Sign Up' : 'Job Seeker Sign Up'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {role === 'employer' ? 'Start hiring top talent today' : 'Find your dream job'}
            </p>
          </div>

          <form onSubmit={handleRegister}>
            
            {errorMsg && (
              <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            {/* Role Selection Dropdown */}
            <div className="form-group delay-100 animate-slide-up">
              <label className="form-label">I am a...</label>
              <select 
                className="input-glass" 
                style={{ background: 'rgba(255,255,255,0.8)', cursor: 'pointer', paddingRight: '16px' }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            <div className="form-group delay-200 animate-slide-up">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-glass" 
                  style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.8)' }} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
            </div>

            <div className="form-group delay-300 animate-slide-up">
              <label className="form-label">Work Email / Email</label>
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

            <div className="form-group delay-400 animate-slide-up">
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
              <small style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                Must be at least 12 chars: uppercase, lowercase, number, special char.
              </small>
            </div>

            {role === 'employer' && (
              <div className="form-group delay-400 animate-slide-up">
                <label className="form-label">Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-glass" 
                    style={{ paddingLeft: '40px', background: 'rgba(255,255,255,0.8)' }} 
                    placeholder="Acme Corp" 
                    required 
                  />
                </div>
              </div>
            )}

            <button disabled={isLoading} type="submit" className="btn-primary delay-400 animate-slide-up" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="delay-400 animate-slide-up" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-main)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
