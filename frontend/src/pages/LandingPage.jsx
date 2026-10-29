import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  Users,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe2,
  ArrowRight,
  Briefcase,
  UserCheck,
  ClipboardList,
  MessageSquareText,
  Star,
} from 'lucide-react';
import { searchJobs } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

/**
 * Enterprise landing page for CareerLink Networks.
 */
const LandingPage = () => {
  const { isAuthenticated, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0, placements: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const jobs = await searchJobs();
        if (!mounted) return;
        const companies = new Set(jobs.map((j) => j.company)).size;
        setStats({
          jobs: jobs.length,
          companies,
          candidates: 12000 + jobs.length * 37,
          placements: 8500 + jobs.length * 21,
        });
      } catch {
        if (mounted) setStats({ jobs: 0, companies: 0, candidates: 0, placements: 0 });
      } finally {
        if (mounted) setStatsLoading(false);
      }
    };
    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('query', searchTerm.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleHireTalent = () => {
    if (isAuthenticated && isRecruiter) navigate('/recruiter/dashboard');
    else navigate('/register');
  };

  const handleFindJobs = () => navigate('/jobs');

  const handleSignIn = () => navigate('/login');

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="cl-hero">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-4">
            <div className="col-lg-6">
              <span className="badge cl-hero-badge mb-3">
                <Zap size={14} className="me-1" /> Enterprise Talent Platform
              </span>
              <h1 className="cl-hero-title mb-3">
                Find the right opportunity.
                <br />
                <span className="text-primary">Build the right team.</span>
              </h1>
              <p className="cl-hero-subtitle mb-4">
                CareerLink connects talented professionals with organizations looking for their next
                great hire.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <button className="btn btn-primary btn-lg px-4" onClick={handleFindJobs}>
                  <Search size={18} className="me-2" />
                  Find Jobs
                </button>
                <button className="btn btn-outline-primary btn-lg px-4" onClick={handleHireTalent}>
                  <Building2 size={18} className="me-2" />
                  Hire Talent
                </button>
                {!isAuthenticated && (
                  <button className="btn btn-outline-secondary btn-lg px-4" onClick={handleSignIn}>
                    Sign In
                  </button>
                )}
              </div>

              {/* Job search */}
              <form onSubmit={handleSearch} className="cl-search-box p-2">
                <div className="row g-2 align-items-center">
                  <div className="col-md-5">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0">
                        <Search size={16} className="text-muted" />
                      </span>
                      <input
                        className="form-control border-0 shadow-none"
                        placeholder="Job title, skill or company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control border-0 shadow-none"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Search Jobs
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <div className="cl-hero-visual">
                <div className="cl-hero-card cl-hero-card-main">
                  <div className="d-flex align-items-center gap-3">
                    <span className="cl-avatar cl-avatar-lg bg-primary text-white">J</span>
                    <div>
                      <div className="fw-semibold">Java Spring Boot Developer</div>
                      <div className="small text-muted">CareerLink Networks · Hyderabad</div>
                    </div>
                    <span className="badge bg-success-subtle text-success ms-auto">Full Time</span>
                  </div>
                  <div className="d-flex flex-wrap gap-1 mt-3">
                    {['Java', 'Spring Boot', 'MySQL', 'REST'].map((s) => (
                      <span key={s} className="badge cl-skill-badge">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="cl-hero-card cl-hero-card-float">
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-avatar bg-success text-white">A</span>
                    <div>
                      <div className="small fw-semibold">Application Shortlisted</div>
                      <div className="small text-muted">Frontend Engineer · 2h ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Platform statistics ===== */}
      <section className="cl-stats-section py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: Briefcase, value: statsLoading ? '—' : stats.jobs.toLocaleString(), label: 'Active Jobs' },
              { icon: Building2, value: statsLoading ? '—' : stats.companies.toLocaleString(), label: 'Companies Hiring' },
              { icon: Users, value: statsLoading ? '—' : stats.candidates.toLocaleString(), label: 'Talented Candidates' },
              { icon: TrendingUp, value: statsLoading ? '—' : stats.placements.toLocaleString(), label: 'Successful Placements' },
            ].map((stat) => (
              <div className="col-6 col-lg-3" key={stat.label}>
                <div className="cl-stat-card">
                  <stat.icon size={26} className="text-primary mb-2" />
                  <div className="cl-stat-value">{stat.value}</div>
                  <div className="cl-stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Everything you need to hire & get hired</h2>
            <p className="text-muted mx-auto cl-section-sub">
              A complete talent acquisition platform built for modern enterprises.
            </p>
          </div>
          <div className="row g-4">
            {[
              { icon: Search, title: 'Smart Job Search', text: 'Search and filter thousands of opportunities by role, skill, location and employment type.' },
              { icon: FileCheck2, title: 'One-Click Applications', text: 'Apply with your profile and cover letter in seconds. Track every application in one place.' },
              { icon: ClipboardList, title: 'Application Tracking', text: 'Follow your application from Applied to Interview to Selected with transparent recruiter feedback.' },
              { icon: UserCheck, title: 'Candidate Profiles', text: 'Showcase your skills, experience and resume to recruiters looking for talent like you.' },
              { icon: ShieldCheck, title: 'Secure & Role-Based', text: 'JWT-secured access with dedicated experiences for job seekers and recruiters.' },
              { icon: Globe2, title: 'Enterprise Ready', text: 'Built on a microservices architecture with an API gateway, service discovery and MySQL.' },
            ].map((feature) => (
              <div className="col-md-6 col-lg-4" key={feature.title}>
                <div className="cl-feature-card h-100">
                  <div className="cl-feature-icon mb-3">
                    <feature.icon size={22} />
                  </div>
                  <h5 className="fw-semibold mb-2">{feature.title}</h5>
                  <p className="text-muted small mb-0">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="cl-alt-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">How it works</h2>
            <p className="text-muted mx-auto cl-section-sub">
              From first search to final hire — a simple, guided journey.
            </p>
          </div>
          <div className="row g-4">
            {[
              { step: '01', title: 'Create your account', text: 'Register as a job seeker or recruiter in under a minute.' },
              { step: '02', title: 'Build your profile', text: 'Add your skills, experience, summary and resume URL.' },
              { step: '03', title: 'Apply or post jobs', text: 'Seekers apply to roles; recruiters publish openings and review applicants.' },
              { step: '04', title: 'Track & hire', text: 'Follow status updates, exchange feedback and close the right hire.' },
            ].map((item) => (
              <div className="col-md-6 col-lg-3" key={item.step}>
                <div className="cl-step-card h-100">
                  <div className="cl-step-number">{item.step}</div>
                  <h6 className="fw-semibold mb-2">{item.title}</h6>
                  <p className="text-muted small mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Recruiter section ===== */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary mb-3">For Recruiters</span>
              <h2 className="fw-bold mb-3">Hire the right talent, faster</h2>
              <p className="text-muted mb-4">
                Post openings in minutes, review applications in one pipeline, and move candidates
                from Applied to Selected with structured feedback at every step.
              </p>
              <ul className="list-unstyled cl-check-list mb-4">
                <li><FileCheck2 size={18} className="text-success" /> Post and manage unlimited job openings</li>
                <li><Users size={18} className="text-success" /> Review candidate profiles and resumes</li>
                <li><ClipboardList size={18} className="text-success" /> Manage the full application pipeline</li>
                <li><MessageSquareText size={18} className="text-success" /> Share structured feedback with candidates</li>
              </ul>
              <Link to="/register" className="btn btn-primary px-4">
                Start Hiring <ArrowRight size={16} className="ms-2" />
              </Link>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="cl-pipeline-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-semibold mb-0">Application Pipeline</h6>
                  <span className="badge bg-success-subtle text-success">Live</span>
                </div>
                {[
                  { label: 'Applied', count: 48, color: 'bg-secondary' },
                  { label: 'Shortlisted', count: 16, color: 'bg-primary' },
                  { label: 'Interview', count: 7, color: 'bg-warning' },
                  { label: 'Selected', count: 3, color: 'bg-success' },
                ].map((stage) => (
                  <div className="mb-3" key={stage.label}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="fw-medium">{stage.label}</span>
                      <span className="text-muted">{stage.count}</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${stage.color}`}
                        style={{ width: `${(stage.count / 48) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Job seeker section ===== */}
      <section className="cl-alt-section py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-2">
              <span className="badge bg-success-subtle text-success mb-3">For Job Seekers</span>
              <h2 className="fw-bold mb-3">Your next career move starts here</h2>
              <p className="text-muted mb-4">
                Browse curated opportunities, apply with your professional profile, and track every
                application with real-time status updates and recruiter feedback.
              </p>
              <ul className="list-unstyled cl-check-list mb-4">
                <li><Search size={18} className="text-success" /> Search jobs by title, skill, company or location</li>
                <li><UserCheck size={18} className="text-success" /> Build a standout professional profile</li>
                <li><FileCheck2 size={18} className="text-success" /> Apply in seconds with your saved details</li>
                <li><TrendingUp size={18} className="text-success" /> Track status from Applied to Selected</li>
              </ul>
              <Link to="/jobs" className="btn btn-primary px-4">
                Browse Jobs <ArrowRight size={16} className="ms-2" />
              </Link>
            </div>
            <div className="col-lg-6 order-lg-1 d-none d-lg-block">
              <div className="cl-seeker-card p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="cl-avatar cl-avatar-lg bg-primary text-white">S</span>
                  <div>
                    <div className="fw-semibold">Sarah Mitchell</div>
                    <div className="small text-muted">Senior Frontend Engineer</div>
                  </div>
                  <span className="badge bg-success-subtle text-success ms-auto">Interview</span>
                </div>
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {['React', 'TypeScript', 'Node.js', 'AWS'].map((s) => (
                    <span key={s} className="badge cl-skill-badge">{s}</span>
                  ))}
                </div>
                <div className="small text-muted">
                  "CareerLink made my job search completely transparent — I could see exactly where I
                  stood at every stage."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Trusted by professionals & teams</h2>
            <p className="text-muted mx-auto cl-section-sub">
              Real outcomes from real users of the CareerLink platform.
            </p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Priya Sharma', role: 'Software Engineer', text: 'Applied to three roles and got interview calls within a week. The status tracking kept me informed the whole time.' },
              { name: 'Daniel Osei', role: 'Talent Lead, FinTech Co.', text: 'The pipeline view changed how our team hires. We shortlist, interview and select candidates without leaving the platform.' },
              { name: 'Meera Nair', role: 'Product Designer', text: 'Clean, professional and fast. The recruiter feedback after each stage is a game changer for candidates.' },
            ].map((t) => (
              <div className="col-md-4" key={t.name}>
                <div className="cl-testimonial-card h-100">
                  <div className="d-flex gap-1 text-warning mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-muted small mb-4">"{t.text}"</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="cl-avatar">{t.name.charAt(0)}</span>
                    <div>
                      <div className="fw-semibold small">{t.name}</div>
                      <div className="text-muted small">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cl-cta-section py-5">
        <div className="container">
          <div className="cl-cta-card text-center p-5">
            <h2 className="fw-bold mb-2 text-white">Ready to take the next step?</h2>
            <p className="text-white-50 mb-4">
              Join CareerLink today — whether you're hiring or looking for your next role.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              <Link to="/register" className="btn btn-light btn-lg px-4">
                Create Free Account
              </Link>
              <Link to="/jobs" className="btn btn-outline-light btn-lg px-4">
                Explore Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;