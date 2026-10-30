import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import SeekerLayout from './layouts/SeekerLayout';
import RecruiterLayout from './layouts/RecruiterLayout';

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

import SeekerDashboard from './pages/seeker/SeekerDashboard';
import BrowseJobs from './pages/seeker/BrowseJobs';
import JobDetails from './pages/seeker/JobDetails';
import ApplyJob from './pages/seeker/ApplyJob';
import MyApplications from './pages/seeker/MyApplications';
import MyProfile from './pages/seeker/MyProfile';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobs from './pages/recruiter/ManageJobs';
import CreateJob from './pages/recruiter/CreateJob';
import EditJob from './pages/recruiter/EditJob';
import Applications from './pages/recruiter/Applications';
import CandidateDetails from './pages/recruiter/CandidateDetails';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

/**
 * Role-aware home redirect: authenticated users go to their dashboard.
 */
const HomeRedirect = () => {
  const { isAuthenticated, isRecruiter } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isRecruiter ? '/recruiter/dashboard' : '/dashboard'} replace />;
  }
  return <LandingPage />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Job seeker routes */}
      <Route
        element={
          <RoleRoute role="CANDIDATE">
            <SeekerLayout />
          </RoleRoute>
        }
      >
        <Route path="/dashboard" element={<SeekerDashboard />} />
        <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/profile" element={<MyProfile />} />
      </Route>

      {/* Recruiter routes */}
      <Route
        element={
          <RoleRoute role="RECRUITER">
            <RecruiterLayout />
          </RoleRoute>
        }
      >
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/jobs" element={<ManageJobs />} />
        <Route path="/recruiter/jobs/new" element={<CreateJob />} />
        <Route path="/recruiter/jobs/:id/edit" element={<EditJob />} />
        <Route path="/recruiter/applications" element={<Applications />} />
        <Route path="/recruiter/applications/:id" element={<CandidateDetails />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;