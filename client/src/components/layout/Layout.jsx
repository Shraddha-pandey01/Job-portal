import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, paddingRight: '16px' }}>
        <Sidebar />
        <main className="animate-fade-in" style={{ 
          flex: 1, 
          marginLeft: '24px',
          paddingBottom: '40px' 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
