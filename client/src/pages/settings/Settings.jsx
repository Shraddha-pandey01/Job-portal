import { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import { Moon, Sun, Bell, Shield, Key } from 'lucide-react';

export default function Settings() {
  const [isDark, setIsDark] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/change-password', { currentPassword, newPassword });
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your application preferences and display settings.</p>
      </div>

      <div className="glass-panel animate-slide-up" style={{ padding: '32px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sun size={20} className="glow-text" /> Appearance
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-dark)' }}>Theme Mode</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Switch between light and dark modes</div>
          </div>
          <button 
            onClick={toggleTheme}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
              background: isDark ? 'var(--bg-color-dark)' : 'white',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-dark)', fontWeight: 600,
              boxShadow: 'var(--glass-shadow)',
              transition: 'all 0.3s'
            }}
          >
            {isDark ? <Moon size={16} color="#8b5cf6" /> : <Sun size={16} color="#f59e0b" />}
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>

      <div className="glass-panel animate-slide-up delay-100" style={{ padding: '32px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={20} className="glow-text" /> Notifications
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Email Alerts</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Receive emails when new jobs match your profile</div>
          </div>
          <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary-main)' }} defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Application Updates</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Get notified when your application status changes</div>
          </div>
          <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary-main)' }} defaultChecked />
        </div>
      </div>

      <div className="glass-panel animate-slide-up delay-200" style={{ padding: '32px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} className="glow-text" /> Security
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: showPasswordForm ? '1px solid var(--glass-border)' : 'none' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>Change Password</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Update your account password securely</div>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '6px 16px', fontSize: '13px' }}
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            {showPasswordForm ? 'Cancel' : 'Update'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordUpdate} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px' }}>{error}</div>}
            {message && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontSize: '14px' }}>{message}</div>}
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Current Password</label>
              <input 
                type="password" 
                className="input-glass" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="input-glass" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="•••••••• (Min 6 chars)" 
                required 
              />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <input 
                type="password" 
                className="input-glass" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ alignSelf: 'flex-start', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Password'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
