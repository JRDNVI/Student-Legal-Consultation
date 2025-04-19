import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/signup';
import ConfirmSignupPage from './pages/auth/confirmSignup';
import Dashboard from './pages/dashboard/dashboard';
import Assignment from './pages/student/assignment';
import ProtectedRoute from './context/ProtectedRoute';
import StudentMatching from './pages/student/onboarding/studentMatching';
import MeetMentor  from './pages/student/onboarding/meetMentor';

// Not finsihed yet - QueryProvider needs to be implemented

// This is the main entry point of the application.
// It sets up the routing for the application using react-router-dom.
// The AuthProvider component is used to provide authentication context to the entire application.

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirmSignup" element={<ConfirmSignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student-matching" element={<ProtectedRoute><StudentMatching /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/assignments" element={<ProtectedRoute><Assignment /></ProtectedRoute>} />
          <Route path="/meet-mentor" element={<ProtectedRoute><MeetMentor /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;