
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import SetupForm from './components/Auth/SetupForm';

// Employee Pages
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import EmployeeTasks from './pages/Employee/EmployeeTasks';
import EmployeeCalendar from './pages/Employee/EmployeeCalendar';
import EmployeeReports from './pages/Employee/EmployeeReports';
import EmployeeChat from './pages/Employee/EmployeeChat';
import EmployeeSettings from './pages/Employee/EmployeeSettings';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProjects from './pages/Admin/AdminProjects';
import AdminTasks from './pages/Admin/AdminTasks';
import AdminCalendar from './pages/Admin/AdminCalendar';
import AdminReports from './pages/Admin/AdminReports';
import AdminTeam from './pages/Admin/AdminTeam';
import AdminChat from './pages/Admin/AdminChat';
import AdminSettings from './pages/Admin/AdminSettings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : '/employee'} replace /> : <LoginForm />
        } />
        
        <Route path="/setup" element={
          isAuthenticated ? <SetupForm /> : <Navigate to="/login" replace />
        } />
        
        {/* Employee Routes */}
        <Route path="/employee" element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee/tasks" element={
          <ProtectedRoute>
            <EmployeeTasks />
          </ProtectedRoute>
        } />
        <Route path="/employee/calendar" element={
          <ProtectedRoute>
            <EmployeeCalendar />
          </ProtectedRoute>
        } />
        <Route path="/employee/reports" element={
          <ProtectedRoute>
            <EmployeeReports />
          </ProtectedRoute>
        } />
        <Route path="/employee/chat" element={
          <ProtectedRoute>
            <EmployeeChat />
          </ProtectedRoute>
        } />
        <Route path="/employee/settings" element={
          <ProtectedRoute>
            <EmployeeSettings />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        } />
        <Route path="/admin/tasks" element={
          <ProtectedRoute>
            <AdminTasks />
          </ProtectedRoute>
        } />
        <Route path="/admin/calendar" element={
          <ProtectedRoute>
            <AdminCalendar />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute>
            <AdminReports />
          </ProtectedRoute>
        } />
        <Route path="/admin/team" element={
          <ProtectedRoute>
            <AdminTeam />
          </ProtectedRoute>
        } />
        <Route path="/admin/chat" element={
          <ProtectedRoute>
            <AdminChat />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={
          <Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/employee') : '/login'} replace />
        } />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;