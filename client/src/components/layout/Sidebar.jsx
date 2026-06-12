import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, FileText, Settings, User, Plus, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();

  const menuItems = role === 'employer' ? [
    { name: 'Dashboard', path: '/employer/dashboard', icon: <Home size={20} /> },
    { name: 'Post Job', path: '/employer/post-job', icon: <Plus size={20} /> },
    { name: 'Manage Jobs', path: '/employer/manage-jobs', icon: <Briefcase size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ] : [
    { name: 'Dashboard', path: '/jobseeker/dashboard', icon: <Home size={20} /> },
    { name: 'Browse Jobs', path: '/jobseeker/jobs', icon: <Briefcase size={20} /> },
    { name: 'Applied Jobs', path: '/jobseeker/applications', icon: <FileText size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="glass-panel animate-slide-up delay-100" style={{
      width: '260px',
      height: 'calc(100vh - 100px)',
      position: 'sticky',
      top: '90px',
      marginLeft: '16px',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', 
        color: 'var(--text-muted)', marginBottom: '16px', marginLeft: '12px', fontWeight: 600
      }}>Main Menu</div>

      {menuItems.map(item => {
        const isActive = location.pathname.includes(item.path);
        return (
          <Link 
            key={item.name} 
            to={item.path}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px',
              textDecoration: 'none', color: isActive ? 'var(--primary-main)' : 'var(--text-dark)',
              background: isActive ? 'var(--primary-glow)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? 'inset 2px 0 0 var(--primary-main)' : 'none'
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        )
      })}

    </aside>
  );
}
