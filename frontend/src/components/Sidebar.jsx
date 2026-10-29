import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  FileText,
  UserCircle,
  Briefcase,
  Users,
  LogOut,
} from 'lucide-react';

/**
 * Dashboard sidebar — role-aware navigation for the authenticated layouts.
 * Collapses to a bottom navigation bar on small screens (handled in layouts).
 */
const Sidebar = () => {
  const { isRecruiter, user, logout } = useAuth();

  const candidateItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/jobs', label: 'Find Jobs', icon: Search },
    { to: '/applications', label: 'My Applications', icon: FileText },
    { to: '/profile', label: 'My Profile', icon: UserCircle },
  ];

  const recruiterItems = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/recruiter/jobs', label: 'My Jobs', icon: Briefcase },
    { to: '/recruiter/applications', label: 'Applications', icon: Users },
    { to: '/recruiter/profile', label: 'Profile', icon: UserCircle },
  ];

  const items = isRecruiter ? recruiterItems : candidateItems;

  return (
    <aside className="cl-sidebar d-none d-lg-flex flex-column">
      <div className="cl-sidebar-user px-3 py-3">
        <div className="d-flex align-items-center gap-2">
          <span className="cl-avatar cl-avatar-lg">
            {(user?.fullName || 'U').charAt(0).toUpperCase()}
          </span>
          <div className="text-truncate">
            <div className="fw-semibold text-dark text-truncate">{user?.fullName}</div>
            <div className="small text-muted text-truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      <nav className="cl-sidebar-nav flex-grow-1 px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `cl-sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-1 ${
                isActive ? 'active' : ''
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-top">
        <button className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2" onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;