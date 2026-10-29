import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter } from 'lucide-react';

/**
 * Site footer shown on public pages.
 */
const Footer = () => {
  return (
    <footer className="cl-footer">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="cl-logo-icon">
                <Briefcase size={18} />
              </span>
              <span className="cl-brand-text fs-5">
                Career<span className="text-primary">Link</span>
              </span>
            </div>
            <p className="text-muted small mb-3">
              CareerLink connects talented professionals with organizations looking for their next
              great hire. Enterprise-grade talent acquisition, simplified.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="cl-social-icon" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="cl-social-icon" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="cl-social-icon" aria-label="GitHub">
                <Github size={16} />
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-semibold mb-3">Platform</h6>
            <ul className="list-unstyled cl-footer-links">
              <li><Link to="/jobs">Find Jobs</Link></li>
              <li><Link to="/register">Post a Job</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-semibold mb-3">For Candidates</h6>
            <ul className="list-unstyled cl-footer-links">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/register">Create Profile</Link></li>
              <li><Link to="/login">Track Applications</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-semibold mb-3">For Recruiters</h6>
            <ul className="list-unstyled cl-footer-links">
              <li><Link to="/register">Post Jobs</Link></li>
              <li><Link to="/login">Manage Applicants</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled cl-footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="cl-footer-bottom">
        <div className="container py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span className="small text-muted">
            © {new Date().getFullYear()} CareerLink Networks. All rights reserved.
          </span>
          <span className="small text-muted">Enterprise Talent Acquisition & Job Application Tracking Portal</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;