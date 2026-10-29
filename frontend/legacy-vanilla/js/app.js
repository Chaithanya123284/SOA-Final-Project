/**
 * CareerLink Networks - Single Page Application Client
 * Connects to Spring Cloud Gateway (Port 8080) with JWT Auth, Role-based UI & Workflows.
 */

const CONFIG = {
    GATEWAY_URL: 'http://localhost:8080',
    AUTH_URL: 'http://localhost:8080/api/v1/auth',
    PROFILE_URL: 'http://localhost:8080/api/v1/profiles',
    JOB_URL: 'http://localhost:8080/api/v1/jobs',
    APPLICATION_URL: 'http://localhost:8080/api/v1/applications'
};

// Global App State
let state = {
    token: localStorage.getItem('careerlink_token') || null,
    user: JSON.parse(localStorage.getItem('careerlink_user')) || null,
    currentTab: 'jobs-tab',
    jobs: [],
    myApplications: [],
    recruiterJobs: [],
    currentApplicants: []
};

// DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateAuthUI();
    loadJobs();

    // If already logged in, load appropriate user data
    if (state.token && state.user) {
        if (isRecruiter()) {
            loadRecruiterJobs();
        } else {
            loadMyApplications();
            loadProfile();
        }
    }
});

// Setup All UI Event Handlers
function setupEventListeners() {
    // Nav Tabs Switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Auth Modal Handlers
    document.getElementById('openLoginModalBtn').addEventListener('click', () => showAuthModal(false));
    document.getElementById('closeAuthModalBtn').addEventListener('click', hideAuthModal);
    document.getElementById('showLoginTabBtn').addEventListener('click', () => toggleAuthTabs('login'));
    document.getElementById('showRegisterTabBtn').addEventListener('click', () => toggleAuthTabs('register'));

    // Register Role toggle
    document.getElementById('regRole').addEventListener('change', (e) => {
        const companyGroup = document.getElementById('companyNameGroup');
        if (e.target.value === 'RECRUITER') {
            companyGroup.classList.remove('hidden');
        } else {
            companyGroup.classList.add('hidden');
        }
    });

    // Form Submissions
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
    document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Quick Demo Buttons
    document.getElementById('quickCandidateLogin').addEventListener('click', () => {
        document.getElementById('loginEmail').value = 'candidate@careerlink.com';
        document.getElementById('loginPassword').value = 'Password123!';
        executeLogin('candidate@careerlink.com', 'Password123!');
    });

    document.getElementById('quickRecruiterLogin').addEventListener('click', () => {
        document.getElementById('loginEmail').value = 'recruiter@careerlink.com';
        document.getElementById('loginPassword').value = 'Password123!';
        executeLogin('recruiter@careerlink.com', 'Password123!');
    });

    // Search & Filter Jobs
    document.getElementById('searchJobsBtn').addEventListener('click', loadJobs);
    document.getElementById('jobSearchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') loadJobs();
    });

    // Modals Close
    document.getElementById('closeApplyModalBtn').addEventListener('click', () => {
        document.getElementById('applyModal').classList.add('hidden');
    });
    document.getElementById('closeCreateJobModalBtn').addEventListener('click', () => {
        document.getElementById('createJobModal').classList.add('hidden');
    });
    document.getElementById('closeReviewModalBtn').addEventListener('click', () => {
        document.getElementById('reviewModal').classList.add('hidden');
    });

    // Apply Form Submission
    document.getElementById('applyForm').addEventListener('submit', handleApplySubmit);

    // Profile Save
    document.getElementById('saveProfileBtn').addEventListener('click', handleSaveProfile);

    // Recruiter Actions
    document.getElementById('openCreateJobModalBtn').addEventListener('click', () => {
        document.getElementById('createJobModal').classList.remove('hidden');
    });
    document.getElementById('createJobForm').addEventListener('submit', handleCreateJobSubmit);
    document.getElementById('reviewForm').addEventListener('submit', handleReviewSubmit);
    document.getElementById('refreshApplicationsBtn').addEventListener('click', loadMyApplications);
}

// Tab Switcher
function switchTab(tabId) {
    state.currentTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('hidden', p.id !== tabId);
        p.classList.toggle('active', p.id === tabId);
    });

    if (tabId === 'jobs-tab') loadJobs();
    if (tabId === 'applications-tab') loadMyApplications();
    if (tabId === 'profile-tab') loadProfile();
    if (tabId === 'recruiter-jobs-tab') loadRecruiterJobs();
    if (tabId === 'recruiter-applicants-tab') loadRecruiterApplicants();
}

// Authentication Handlers
function showAuthModal(isRegister = false) {
    document.getElementById('authModal').classList.remove('hidden');
    toggleAuthTabs(isRegister ? 'register' : 'login');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

function toggleAuthTabs(mode) {
    const isLogin = mode === 'login';
    document.getElementById('showLoginTabBtn').classList.toggle('active', isLogin);
    document.getElementById('showRegisterTabBtn').classList.toggle('active', !isLogin);
    document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
    document.getElementById('registerForm').classList.toggle('hidden', isLogin);
    document.getElementById('authModalTitle').innerText = isLogin ? 'Welcome Back to CareerLink' : 'Join CareerLink Networks';
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    await executeLogin(email, password);
}

async function executeLogin(email, password) {
    try {
        const response = await fetch(`${CONFIG.AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Login failed. Invalid credentials.');
        }

        const data = await response.json();
        state.token = data.token;
        state.user = {
            id: data.id,
            fullName: data.fullName,
            email: data.email,
            companyName: data.companyName,
            roles: data.roles
        };

        localStorage.setItem('careerlink_token', state.token);
        localStorage.setItem('careerlink_user', JSON.stringify(state.user));

        hideAuthModal();
        updateAuthUI();
        showToast(`Welcome back, ${data.fullName}!`, 'success');

        if (isRecruiter()) {
            switchTab('recruiter-jobs-tab');
            loadRecruiterJobs();
        } else {
            switchTab('jobs-tab');
            loadMyApplications();
            loadProfile();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const companyName = document.getElementById('regCompany').value;

    try {
        const response = await fetch(`${CONFIG.AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, role, companyName })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Registration failed');
        }

        showToast('Registration successful! Logging you in...', 'success');
        await executeLogin(email, password);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function handleLogout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('careerlink_token');
    localStorage.removeItem('careerlink_user');
    updateAuthUI();
    switchTab('jobs-tab');
    showToast('Logged out successfully.', 'info');
}

function updateAuthUI() {
    const unauthView = document.getElementById('unauthenticatedView');
    const authView = document.getElementById('authenticatedView');
    const candidateTabs = document.querySelectorAll('.candidate-only');
    const recruiterTabs = document.querySelectorAll('.recruiter-only');

    if (state.token && state.user) {
        unauthView.classList.add('hidden');
        authView.classList.remove('hidden');

        document.getElementById('navUserName').innerText = state.user.fullName;
        document.getElementById('navUserAvatar').innerText = state.user.fullName.charAt(0).toUpperCase();

        const role = isRecruiter() ? 'RECRUITER' : 'CANDIDATE';
        document.getElementById('navUserRole').innerText = role;

        if (isRecruiter()) {
            candidateTabs.forEach(t => t.classList.add('hidden'));
            recruiterTabs.forEach(t => t.classList.remove('hidden'));
        } else {
            candidateTabs.forEach(t => t.classList.remove('hidden'));
            recruiterTabs.forEach(t => t.classList.add('hidden'));
        }
    } else {
        unauthView.classList.remove('hidden');
        authView.classList.add('hidden');
        candidateTabs.forEach(t => t.classList.add('hidden'));
        recruiterTabs.forEach(t => t.classList.add('hidden'));
    }
}

function isRecruiter() {
    if (!state.user || !state.user.roles) return false;
    return state.user.roles.includes('ROLE_RECRUITER');
}

// Jobs Controller
async function loadJobs() {
    const query = document.getElementById('jobSearchInput').value;
    const location = document.getElementById('jobLocationInput').value;
    const employmentType = document.getElementById('employmentTypeSelect').value;

    let url = `${CONFIG.JOB_URL}?`;
    if (query) url += `query=${encodeURIComponent(query)}&`;
    if (location) url += `location=${encodeURIComponent(location)}&`;
    if (employmentType) url += `employmentType=${encodeURIComponent(employmentType)}&`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Could not fetch jobs');
        const jobs = await response.json();
        state.jobs = jobs;
        renderJobs(jobs);
    } catch (err) {
        console.warn('Jobs load fallback: using direct endpoint or mock data if server not up yet', err);
        // Display initial seeded state
        renderJobs([
            {
                id: 1,
                title: "Senior Java Cloud Engineer",
                company: "TechCorp Global",
                location: "San Francisco, CA (Hybrid)",
                employmentType: "FULL_TIME",
                minSalary: 140000,
                maxSalary: 175000,
                requiredSkills: ["Java", "Spring Boot", "Spring Cloud", "Docker", "Kubernetes", "Kafka"],
                description: "Join TechCorp's core infrastructure team to build high-throughput microservices using Spring Boot, Spring Cloud, Kafka, and Kubernetes.",
                status: "OPEN"
            },
            {
                id: 2,
                title: "Full Stack Developer (React & Java)",
                company: "TechCorp Global",
                location: "Remote",
                employmentType: "REMOTE",
                minSalary: 120000,
                maxSalary: 150000,
                requiredSkills: ["React", "JavaScript", "Java", "Spring Boot", "PostgreSQL", "REST API"],
                description: "Develop intuitive user interfaces in React while designing RESTful microservice backends with Spring Boot and PostgreSQL.",
                status: "OPEN"
            },
            {
                id: 3,
                title: "DevOps & SRE Engineer",
                company: "CloudScale Networks",
                location: "Austin, TX",
                employmentType: "FULL_TIME",
                minSalary: 130000,
                maxSalary: 160000,
                requiredSkills: ["Kubernetes", "Terraform", "Docker", "AWS", "CI/CD", "Linux"],
                description: "Manage multi-region Kubernetes clusters, monitor system reliability, and maintain automated GitHub Actions CI/CD workflows.",
                status: "OPEN"
            }
        ]);
    }
}

function renderJobs(jobs) {
    const container = document.getElementById('jobCardsContainer');
    document.getElementById('jobsCountBadge').innerText = jobs.length;

    if (!jobs || jobs.length === 0) {
        container.innerHTML = `<div class="empty-state">No matching job postings found.</div>`;
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-card">
            <div>
                <div class="job-card-header">
                    <div>
                        <h3 class="job-title">${escapeHtml(job.title)}</h3>
                        <div class="job-company"><i class="fa-solid fa-building"></i> ${escapeHtml(job.company)}</div>
                    </div>
                    <span class="badge ${job.status === 'OPEN' ? 'badge-open' : 'badge-closed'}">${job.status}</span>
                </div>
                <div class="job-meta-row">
                    <span class="job-meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(job.location)}</span>
                    <span class="job-meta-item"><i class="fa-solid fa-briefcase"></i> ${job.employmentType}</span>
                </div>
                <p class="job-desc-snippet">${escapeHtml(job.description ? job.description.substring(0, 160) + '...' : '')}</p>
                <div class="job-skills-tags">
                    ${(job.requiredSkills || []).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
                </div>
            </div>
            <div class="job-card-footer">
                <div class="job-salary">$${(job.minSalary || 0).toLocaleString()} - $${(job.maxSalary || 0).toLocaleString()} <span style="font-size:0.75rem; color:var(--text-muted)">/yr</span></div>
                ${isRecruiter() ? `
                    <span class="badge badge-info"><i class="fa-solid fa-users"></i> ${job.applicantsCount || 0} applicants</span>
                ` : `
                    <button class="btn btn-primary btn-sm" onclick="openApplyModal(${job.id}, '${escapeHtml(job.title)}', '${escapeHtml(job.company)}')">
                        <i class="fa-solid fa-paper-plane"></i> Apply Now
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

// Application Modal & Submission
window.openApplyModal = function(jobId, jobTitle, company) {
    if (!state.token) {
        showAuthModal(false);
        showToast('Please sign in as a Candidate to apply for jobs', 'info');
        return;
    }
    if (isRecruiter()) {
        showToast('Recruiters cannot apply for jobs. Please switch to a Candidate account.', 'error');
        return;
    }

    document.getElementById('applyJobId').value = jobId;
    document.getElementById('applyModalJobTitle').innerText = jobTitle;
    document.getElementById('applyModalCompany').innerText = company;
    document.getElementById('applyCandidateName').value = state.user.fullName;
    document.getElementById('applyCandidateEmail').value = state.user.email;
    document.getElementById('applyResumeUrl').value = 'https://careerlink.s3.amazonaws.com/resumes/alex_morgan_cv.pdf';
    document.getElementById('applyCoverLetter').value = 'I am excited to submit my application for this role. With my background in Spring Boot microservices and cloud engineering, I believe I can make an immediate impact on your team.';

    document.getElementById('applyModal').classList.remove('hidden');
};

async function handleApplySubmit(e) {
    e.preventDefault();
    const jobId = document.getElementById('applyJobId').value;
    const coverLetter = document.getElementById('applyCoverLetter').value;
    const resumeUrl = document.getElementById('applyResumeUrl').value;

    const payload = {
        candidateId: state.user.id,
        candidateName: state.user.fullName,
        candidateEmail: state.user.email,
        jobId: parseInt(jobId),
        coverLetter: coverLetter,
        resumeUrl: resumeUrl
    };

    try {
        const response = await fetch(`${CONFIG.APPLICATION_URL}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`,
                'X-User-Id': state.user.id.toString()
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 409) {
            throw new Error('You have already applied for this job!');
        }

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to submit application.');
        }

        document.getElementById('applyModal').classList.add('hidden');
        showToast('Application successfully submitted! Recruiter has been notified.', 'success');
        loadMyApplications();
        switchTab('applications-tab');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Candidate My Applications
async function loadMyApplications() {
    if (!state.token || isRecruiter()) return;

    try {
        const response = await fetch(`${CONFIG.APPLICATION_URL}/my-applications?candidateId=${state.user.id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'X-User-Id': state.user.id.toString()
            }
        });

        if (!response.ok) throw new Error('Could not fetch applications');
        const apps = await response.json();
        state.myApplications = apps;
        renderApplications(apps);
    } catch (err) {
        console.warn('Fallback loading mock applications', err);
        renderApplications([
            {
                id: 1,
                jobTitle: "Senior Java Cloud Engineer",
                company: "TechCorp Global",
                status: "SHORTLISTED",
                latestFeedback: "Profile shortlisted for technical screening.",
                appliedAt: "2026-09-18T10:30:00"
            },
            {
                id: 2,
                jobTitle: "Full Stack Developer (React & Java)",
                company: "TechCorp Global",
                status: "SUBMITTED",
                latestFeedback: "Application received and queued for hiring manager review.",
                appliedAt: "2026-09-19T14:15:00"
            }
        ]);
    }
}

function renderApplications(apps) {
    const tbody = document.getElementById('applicationsTableBody');
    if (!apps || apps.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px;">No applications submitted yet. Browse jobs to apply!</td></tr>`;
        return;
    }

    tbody.innerHTML = apps.map(a => `
        <tr>
            <td>
                <strong>${escapeHtml(a.jobTitle)}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(a.company || 'TechCorp')}</div>
            </td>
            <td>${a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : 'Recent'}</td>
            <td><span class="badge badge-status-${a.status}">${a.status.replace('_', ' ')}</span></td>
            <td>
                <div style="font-size: 0.88rem; color: #334155;">
                    ${escapeHtml(a.latestFeedback || 'Pending review by hiring manager')}
                </div>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="showToast('Application ID: #${a.id} - In Review', 'info')">
                    <i class="fa-solid fa-eye"></i> Details
                </button>
            </td>
        </tr>
    `).join('');
}

// Candidate Profile Editor
async function loadProfile() {
    if (!state.token || !state.user || isRecruiter()) return;

    document.getElementById('profileFullName').value = state.user.fullName;
    document.getElementById('profileEmail').value = state.user.email;

    try {
        const response = await fetch(`${CONFIG.PROFILE_URL}/${state.user.id}`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (response.ok) {
            const p = await response.json();
            document.getElementById('profilePhone').value = p.phone || '';
            document.getElementById('profileLocation').value = p.location || '';
            document.getElementById('profileHeadline').value = p.headline || '';
            document.getElementById('profileSummary').value = p.summary || '';
            document.getElementById('profileSkills').value = (p.skills || []).join(', ');
            document.getElementById('profileYearsExp').value = p.yearsOfExperience || '';
            document.getElementById('profileResumeUrl').value = p.resumeUrl || '';
            document.getElementById('profileLinkedin').value = p.linkedinUrl || '';
            document.getElementById('profileGithub').value = p.githubUrl || '';
        }
    } catch (err) {
        console.warn('Profile fetch note: defaults initialized', err);
    }
}

async function handleSaveProfile() {
    if (!state.token || !state.user) return;

    const skillsRaw = document.getElementById('profileSkills').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
        userId: state.user.id,
        fullName: document.getElementById('profileFullName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        location: document.getElementById('profileLocation').value,
        headline: document.getElementById('profileHeadline').value,
        summary: document.getElementById('profileSummary').value,
        skills: skills,
        yearsOfExperience: parseInt(document.getElementById('profileYearsExp').value) || 0,
        resumeUrl: document.getElementById('profileResumeUrl').value,
        linkedinUrl: document.getElementById('profileLinkedin').value,
        githubUrl: document.getElementById('profileGithub').value
    };

    try {
        const response = await fetch(CONFIG.PROFILE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update profile');
        showToast('Profile updated successfully!', 'success');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Recruiter Postings & Review
async function loadRecruiterJobs() {
    if (!isRecruiter()) return;

    try {
        const response = await fetch(`${CONFIG.JOB_URL}/recruiter/${state.user.id}`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        let jobs = [];
        if (response.ok) {
            jobs = await response.json();
        } else {
            // Fallback to all jobs if recruiter-specific endpoint is empty
            const allResp = await fetch(CONFIG.JOB_URL);
            jobs = await allResp.json();
        }

        state.recruiterJobs = jobs;
        renderRecruiterJobs(jobs);

        // Update dropdown for applicant filtering
        const select = document.getElementById('recruiterJobFilterSelect');
        select.innerHTML = `<option value="ALL">All Jobs Requisitions</option>` +
            jobs.map(j => `<option value="${j.id}">${escapeHtml(j.title)}</option>`).join('');

        select.onchange = () => loadRecruiterApplicants(select.value);
        loadRecruiterApplicants();
    } catch (err) {
        console.warn('Recruiter jobs fetch fallback', err);
    }
}

function renderRecruiterJobs(jobs) {
    const container = document.getElementById('recruiterJobsContainer');
    if (!jobs || jobs.length === 0) {
        container.innerHTML = `<div class="empty-state">No job listings posted yet. Click "Post New Job" above to create one.</div>`;
        return;
    }

    container.innerHTML = jobs.map(j => `
        <div class="job-card">
            <div class="job-card-header">
                <div>
                    <h3 class="job-title">${escapeHtml(j.title)}</h3>
                    <div class="job-company">${escapeHtml(j.company)}</div>
                </div>
                <span class="badge ${j.status === 'OPEN' ? 'badge-open' : 'badge-closed'}">${j.status}</span>
            </div>
            <div class="job-meta-row">
                <span class="job-meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(j.location)}</span>
                <span class="job-meta-item"><i class="fa-solid fa-clock"></i> ${j.employmentType}</span>
            </div>
            <div class="job-card-footer">
                <span class="badge badge-info"><i class="fa-solid fa-users"></i> ${j.applicantsCount || 0} applicants</span>
                <button class="btn btn-outline btn-sm" onclick="switchTab('recruiter-applicants-tab'); document.getElementById('recruiterJobFilterSelect').value = '${j.id}'; loadRecruiterApplicants(${j.id});">
                    Review Applicants
                </button>
            </div>
        </div>
    `).join('');
}

async function handleCreateJobSubmit(e) {
    e.preventDefault();
    if (!isRecruiter()) return;

    const skillsRaw = document.getElementById('newJobSkills').value;
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
        title: document.getElementById('newJobTitle').value,
        company: document.getElementById('newJobCompany').value,
        location: document.getElementById('newJobLocation').value,
        employmentType: document.getElementById('newJobType').value,
        minSalary: parseFloat(document.getElementById('newJobMinSalary').value) || 100000,
        maxSalary: parseFloat(document.getElementById('newJobMaxSalary').value) || 140000,
        requiredSkills: skills,
        description: document.getElementById('newJobDescription').value,
        requirements: document.getElementById('newJobRequirements').value,
        recruiterId: state.user.id,
        recruiterEmail: state.user.email,
        status: 'OPEN'
    };

    try {
        const response = await fetch(CONFIG.JOB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to create job posting');

        document.getElementById('createJobModal').classList.add('hidden');
        document.getElementById('createJobForm').reset();
        showToast('New job requisition published successfully!', 'success');
        loadRecruiterJobs();
        loadJobs();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function loadRecruiterApplicants(jobId = 'ALL') {
    if (!isRecruiter()) return;

    try {
        let url = `${CONFIG.APPLICATION_URL}/job/1`; // Default demo job 1
        if (jobId !== 'ALL') {
            url = `${CONFIG.APPLICATION_URL}/job/${jobId}`;
        }

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });

        if (!response.ok) throw new Error('Could not load applicants');
        const apps = await response.json();
        renderRecruiterApplicants(apps);
    } catch (err) {
        console.warn('Fallback loading mock applicants', err);
        renderRecruiterApplicants([
            {
                id: 1,
                candidateId: 1,
                candidateName: "Alex Morgan",
                candidateEmail: "candidate@careerlink.com",
                jobTitle: "Senior Java Cloud Engineer",
                company: "TechCorp Global",
                status: "SHORTLISTED",
                coverLetter: "I have over 4 years of experience architecting distributed systems with Spring Cloud, Eureka, and Docker.",
                resumeUrl: "https://careerlink.s3.amazonaws.com/resumes/alex_morgan_cv.pdf",
                latestFeedback: "Strong candidate in Spring Cloud."
            }
        ]);
    }
}

function renderRecruiterApplicants(apps) {
    const container = document.getElementById('recruiterApplicantsContainer');
    if (!apps || apps.length === 0) {
        container.innerHTML = `<div class="empty-state">No candidates have applied for this job yet.</div>`;
        return;
    }

    container.innerHTML = apps.map(app => `
        <div class="applicant-card">
            <div class="applicant-card-header">
                <div>
                    <h3 style="font-size: 1.1rem; font-weight:700;">${escapeHtml(app.candidateName)}</h3>
                    <div style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(app.candidateEmail)}</div>
                    <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-top:4px;">Applied for: ${escapeHtml(app.jobTitle)}</div>
                </div>
                <span class="badge badge-status-${app.status}">${app.status.replace('_', ' ')}</span>
            </div>
            <p style="font-size:0.86rem; color:#475569; margin: 10px 0;"><strong>Cover Letter:</strong> ${escapeHtml(app.coverLetter || 'No cover letter provided.')}</p>
            ${app.latestFeedback ? `<div style="background:#f8fafc; padding:8px; border-radius:6px; font-size:0.8rem; margin-bottom:12px;"><strong>Recruiter Notes:</strong> ${escapeHtml(app.latestFeedback)}</div>` : ''}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 14px; border-top:1px solid #f1f5f9; padding-top:12px;">
                <a href="${escapeHtml(app.resumeUrl || '#')}" target="_blank" class="btn btn-outline btn-sm">
                    <i class="fa-solid fa-file-pdf"></i> View Resume
                </a>
                <button class="btn btn-primary btn-sm" onclick="openReviewModal(${app.id}, '${escapeHtml(app.candidateName)}', '${escapeHtml(app.jobTitle)}', '${escapeHtml(app.coverLetter || '')}', '${escapeHtml(app.resumeUrl || '')}', '${app.status}')">
                    <i class="fa-solid fa-pen-to-square"></i> Review & Update Status
                </button>
            </div>
        </div>
    `).join('');
}

window.openReviewModal = function(id, name, jobTitle, coverLetter, resumeUrl, status) {
    document.getElementById('reviewApplicationId').value = id;
    document.getElementById('reviewCandidateName').innerText = name;
    document.getElementById('reviewJobTitle').innerText = jobTitle;
    document.getElementById('reviewCoverLetter').innerText = coverLetter;
    document.getElementById('reviewResumeLinkBox').innerHTML = `<a href="${resumeUrl}" target="_blank" style="color:var(--primary); font-size:0.9rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${resumeUrl}</a>`;
    document.getElementById('reviewStatusSelect').value = status;
    document.getElementById('reviewNoteInput').value = '';
    document.getElementById('reviewModal').classList.remove('hidden');
};

async function handleReviewSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('reviewApplicationId').value;
    const status = document.getElementById('reviewStatusSelect').value;
    const feedbackNote = document.getElementById('reviewNoteInput').value;

    const payload = {
        status: status,
        recruiterId: state.user.id,
        recruiterName: state.user.fullName,
        feedbackNote: feedbackNote
    };

    try {
        const response = await fetch(`${CONFIG.APPLICATION_URL}/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`,
                'X-User-Id': state.user.id.toString()
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Could not update application status');

        document.getElementById('reviewModal').classList.add('hidden');
        showToast('Application status updated and candidate notified!', 'success');
        loadRecruiterApplicants();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Toast Notifications Helper
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'circle-check' : (type === 'error' ? 'circle-exclamation' : 'circle-info');
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
