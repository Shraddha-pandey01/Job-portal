import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Landing from './pages/Landing';
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import BrowseJobs from './pages/jobseeker/BrowseJobs';
import JobDetails from './pages/jobseeker/JobDetails';
import AppliedJobs from './pages/jobseeker/AppliedJobs';
import Profile from './pages/profile/Profile';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import EditJob from './pages/employer/EditJob';
import Applicants from './pages/employer/Applicants';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        
        {/* Main App Layout */}
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/jobseeker/jobs" element={<BrowseJobs />} />
          <Route path="/jobseeker/jobs/:jobId" element={<JobDetails />} />
          <Route path="/jobseeker/applications" element={<AppliedJobs />} />

          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/edit-job/:id" element={<EditJob />} />
          <Route path="/employer/manage-jobs" element={<ManageJobs />} />
          <Route path="/employer/jobs/:jobId/applicants" element={<Applicants />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
