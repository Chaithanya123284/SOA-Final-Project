import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firstName } from '../utils/formatters';
import { LogOut, UserCircle, Briefcase, ChevronDown } from 'lucide-react';

/**
 * Role-aware top navigation bar.
 * - Public: Home / Find Jobs / Sign In / Register
 * - Candidate: Dashboard / Find Jobs / My Applications / My Profile
 * - Recruiter: Dashboard / My Jobs / Applications / Profile
 */
const Navbar = () => {
  const { isAuthenticated, isRecruiter, user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const closeNav = () => setExpanded(false);

  const publicLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/jobs', label: 'Find Jobs' },
  ];

  const candidateLinks = [
    { to: '/dashboard', label: 'Dashboard', end: true },
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/applications', label: 'My Applications' },
    { to: '/profile', label: 'My Profile' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard', end: true },
    { to: '/recruiter/jobs', label: 'My Jobs' },
    { to: '/recruiter/applications', label: 'Applications' },
    { to: '/recruiter/profile', label: 'Profile' },
  ];

  const links = !isAuthenticated ? publicLinks : isRecruiter ? recruiterLinks : candidateLinks;

  return (
    <nav className="navbar navbar-expand-lg cl-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeNav}>
          <span className="cl-logo-icon">
            <Briefcase size={18} />
          </span>
          <span className="cl-brand-text">
            Career<span className="text-primary">Link</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `nav-link cl-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeNav}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3" onClick={closeNav}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3" onClick={closeNav}>
                  Register
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn cl-user-btn d-flex align-items-center gap-2"
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                >
                  <span className="cl-avatar">{firstName(user?.fullName).charAt(0).toUpperCase()}</span>
                  <span className="d-none d-sm-inline fw-semibold">{firstName(user?.fullName)}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show cl-dropdown">
                    <li>
                      <span className="dropdown-item-text small text-muted">
                        {user?.email}
                        <br />
                        <span className="badge bg-primary-subtle text-primary mt-1">
                          {isRecruiter ? 'Recruiter' : 'Job Seeker'}
                        </span>
                      </span>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        to={isRecruiter ? '/recruiter/profile' : '/profile'}
                        className="dropdown-item"
                        onClick={() => {
                          setUserMenuOpen(false);
                          closeNav();
                        }}
                      >
                        <UserCircle size={16} className="me-2" />
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <LogOut size={16} className="me-2" />
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;