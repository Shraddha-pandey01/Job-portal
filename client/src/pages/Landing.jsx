import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav className="glass-panel" style={{
        margin: '16px 24px',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={28} color="var(--primary-main)" />
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--primary-main)' }}>Jobelia</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 500, transition: 'color 0.2s' }}>
            Login
          </Link>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div className="glass-panel animate-slide-up" style={{ 
          padding: '8px 16px', 
          borderRadius: '30px', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '32px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: 'var(--primary-main)',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <Briefcase size={16} /> 
          Your Career Starts Here
        </div>

        <h1 className="animate-slide-up delay-100" style={{ 
          fontSize: '64px', 
          fontWeight: 800, 
          lineHeight: 1.1,
          marginBottom: '24px',
          maxWidth: '800px',
          color: 'var(--text-dark)'
        }}>
          Find Your <span className="glow-text">Dream Job</span> Today
        </h1>

        <p className="animate-slide-up delay-200" style={{ 
          fontSize: '18px', 
          color: 'var(--text-muted)', 
          maxWidth: '600px', 
          marginBottom: '48px',
          lineHeight: 1.6
        }}>
          Connect with top employers and discover opportunities that match your skills. Whether you're hiring or job hunting, Jobelia makes it seamless.
        </p>

        <div className="animate-slide-up delay-300" style={{ display: 'flex', gap: '16px' }}>
          <Link to="/signup" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Sign Up
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Login <ArrowRight size={18} />
          </Link>
        </div>
        

      </main>
    </div>
  );
}
