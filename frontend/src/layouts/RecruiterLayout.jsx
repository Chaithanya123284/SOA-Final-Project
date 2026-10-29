import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, Briefcase, Users, UserCircle, LogOut } from 'lucide-react';

/**
 * Recruiter dashboard layout — sidebar (desktop) + bottom nav (mobile).
 */
const RecruiterLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/recruiter/jobs', label: 'My Jobs', icon: Briefcase },
    { to: '/recruiter/applications', label: 'Applicants', icon: Users },
    { to: '/recruiter/profile', label: 'Profile', icon: UserCircle },
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

export default RecruiterLayout;