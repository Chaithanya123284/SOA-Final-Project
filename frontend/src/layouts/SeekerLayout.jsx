import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, Search, FileText, UserCircle, LogOut } from 'lucide-react';

/**
 * Job seeker dashboard layout — sidebar (desktop) + bottom nav (mobile).
 */
const SeekerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/jobs', label: 'Find Jobs', icon: Search },
    { to: '/applications', label: 'Applications', icon: FileText },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="cl-dashboard-shell">
      <Sidebar />
      <div className="cl-dashboard-main">
        <header className="cl-mobile-header d-lg-none d-flex align-items-center justify-content-between px-3 py-2">
          <span className="fw-semibold">CareerLink</span>
          <div className="d-flex align-items-center gap-2">
            <span className="cl-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={handleLogout} aria-label="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="cl-dashboard-content">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <nav className="cl-bottom-nav d-lg-none">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `cl-bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SeekerLayout;