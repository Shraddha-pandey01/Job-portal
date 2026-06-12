import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosClient';

export default function Navbar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications((res.data.payload || []).slice(0, 10));
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [role, user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchNotifications();
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      margin: '0 16px 24px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--primary-main), var(--secondary-main))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
        }}>J</div>
        <h2 className="glow-text" style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>JobPortal</h2>
      </div>

      <div style={{ flex: 1, maxWidth: '400px', margin: '0 24px', position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
        <input 
          type="text" 
          placeholder="Search jobs, companies, or skills..." 
          className="input-glass"
          style={{ paddingLeft: '40px', borderRadius: '24px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        <button 
          onClick={handleBellClick}
          style={{ 
          background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative',
          color: 'var(--text-dark)', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' 
        }}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              {unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="glass-panel animate-fade-in" style={{
            position: 'absolute', top: '48px', right: '120px', width: '320px', padding: '16px',
            maxHeight: '400px', overflowY: 'auto', zIndex: 1000, background: 'white'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Notifications</h4>
            {notifications.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No notifications yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map(n => (
                  <div key={n._id} onClick={() => markAsRead(n._id)} style={{ padding: '12px', borderRadius: '8px', background: n.isRead ? 'var(--bg-color-light)' : 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'background 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{n.title}</strong>
                      {!n.isRead && <div style={{ width: '8px', height: '8px', background: 'var(--primary-main)', borderRadius: '50%' }}></div>}
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.message}</p>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{user?.fullName || 'User'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
            </div>
          </div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--bg-color-dark)', border: '2px solid var(--primary-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={20} color="var(--primary-main)" />
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          title="Sign Out"
          style={{ 
            background: 'transparent', border: 'none', cursor: 'pointer', 
            color: 'var(--text-danger, #ef4444)', padding: '8px', borderRadius: '50%', transition: 'all 0.2s',
            marginLeft: '8px'
          }}>
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
