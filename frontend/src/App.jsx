import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

/* Pages */
import Home from "./pages/Home";
/* Admin Pages */

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import PostJob from "./pages/admin/PostJob";
import AdminApplicants from "./pages/admin/AdminApplicants";
import AdminManagement from "./pages/admin/AdminManagement";
// Import new Admin pages as placeholders or actual if exist, for now just reuse or placeholders for routing
import UserDashboard from "./pages/user/UserDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import PermissionManagement from "./pages/admin/PermissionManagement";
import CreatePermission from "./pages/admin/CreatePermission";
import AdminLogin from "./pages/admin/AdminLogin";
import UserManagement from "./pages/admin/UserManagement";
import ResumeCandidates from "./pages/admin/ResumeCandidates";


import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LinkedInCallback from "./pages/LinkedInCallback";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";

/* Route Protection */
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import RedirectIfSuperAdmin from "./components/RedirectIfSuperAdmin";
import { PERMISSIONS } from "./constants/permissions";

import ResumeGen from "./pages/ResumeGen";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import TalentLeague from "./pages/TalentLeague";
import Creators from "./pages/Creators";

function App() {
  return (
    <Router>
      <Routes>
        {/* ========== Non-Admin Routes (Redirect Super Admin) ========== */}
        <Route element={<RedirectIfSuperAdmin><Outlet /></RedirectIfSuperAdmin>}>
          {/* ========== Public Routes ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/linkedin/callback" element={<LinkedInCallback />} />

          {/* ========== Protected Routes ========== */}
          <Route
            path="/create-profile"
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/resume-gen" element={<ResumeGen />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/talent-league" element={<TalentLeague />} />
          <Route path="/creators" element={<Creators />} />

          {/* Job Seeker Dashboard */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ========== Admin Routes ========== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          {/* General Dashboard */}
          {/* Dashboard Route */}
          <Route path="dashboard" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.DASHBOARD_VIEW}><AdminDashboard /></ProtectedAdminRoute>} />

          {/* Permission Protected Routes */}

          <Route path="jobs" element={<ProtectedAdminRoute><AdminJobs /></ProtectedAdminRoute>} />
          <Route path="jobs/post" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_POST}><PostJob /></ProtectedAdminRoute>} />
          <Route path="jobs/edit/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_EDIT}><PostJob /></ProtectedAdminRoute>} />
          <Route path="jobs/view/:id" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.JOBS_VIEW}><PostJob /></ProtectedAdminRoute>} />
          <Route path="candidates/applicants" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.APPLICANTS_VIEW}><AdminApplicants /></ProtectedAdminRoute>} />

          {/* Signup Candidates - reusing AdminApplicants for now as it fetches all jobseekers */}
          <Route path="candidates/signup" element={<ProtectedAdminRoute><AdminApplicants /></ProtectedAdminRoute>} />

          {/* Resume Candidates */}
          <Route path="candidates/resume" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.RESUME_DOWNLOAD}><ResumeCandidates /></ProtectedAdminRoute>} />

          {/* Super Admin Routes */}
          <Route path="management" element={<ProtectedAdminRoute><AdminManagement /></ProtectedAdminRoute>} />
          <Route path="permissions" element={<ProtectedAdminRoute requiredRole="superadmin"><PermissionManagement /></ProtectedAdminRoute>} />
          <Route path="permissions/create" element={<ProtectedAdminRoute requiredRole="superadmin"><CreatePermission /></ProtectedAdminRoute>} />
          <Route path="permissions/edit/:id" element={<ProtectedAdminRoute requiredRole="superadmin"><CreatePermission /></ProtectedAdminRoute>} />

          {/* User Management */}
          <Route path="users" element={<ProtectedAdminRoute requiredPermission={PERMISSIONS.USERS_EDIT}><UserManagement /></ProtectedAdminRoute>} />
          {/* Placeholder routes for others to prevent crashes if clicked */}
          <Route path="*" element={<div className="p-10">Page Under Construction</div>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;