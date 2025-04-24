import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './context/ProtectedRoute';
import Layout from './components/layout/Layout';

import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/signup';
import ConfirmSignupPage from './pages/auth/confirmSignup';
import Dashboard from './pages/dashboard/dashboard';
import Assignment from './pages/student/assignment';
import StudentMatching from './pages/student/onboarding/studentMatching';
import MeetMentor from './pages/student/onboarding/meetMentor';
import Mentor from './pages/student/mentor';
import MentorSetup from './pages/mentor/onboarding/mentorSetup';
import MentorProfile from './pages/mentor/mentorProfile';
import MentorTasks from './pages/mentor/mentees';
import MentorMeeting from './pages/mentor/meetings';
import StudentMeeting from './pages/student/student-meeting';
import StudentProfile from './pages/student/studentProfile';
import ClientOnboarding from './pages/client/onboarding/clientNeeds';
import MeetSolicitor from './pages/client/onboarding/clientMatching';
import SolicitorOnboarding from './pages/solicitor/onboarding/solicitorOnboarding';
import CaseListPage from './pages/solicitor/cases';
import CaseDetailPage from './pages/solicitor/caseDetail';

// Not finsihed yet - QueryProvider needs to be implemented

// This is the main entry point of the application.
// It sets up the routing for the application using react-router-dom.
// The AuthProvider component is used to provide authentication context to the entire application.

function App() {
  const withLayout = (Component) => (
    <ProtectedRoute>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirmSignup" element={<ConfirmSignupPage />} />

          <Route path="/student-matching" element={<ProtectedRoute><StudentMatching/></ProtectedRoute>} />
          <Route path="/meet-mentor" element={<ProtectedRoute><MeetMentor/></ProtectedRoute>} />
          <Route path="/dashboard" element={withLayout(Dashboard)} />
          <Route path="/assignments" element={withLayout(Assignment)} />
          <Route path="/mentor" element={withLayout(Mentor)} />
          <Route path="/student-meetings" element={withLayout(StudentMeeting)} />
          <Route path="/student-profile" element={withLayout(StudentProfile)} />

          <Route path="/mentor-setup" element={<ProtectedRoute><MentorSetup/></ProtectedRoute>} />
          <Route path="/mentor-profile" element={withLayout(MentorProfile)} />
          <Route path="/mentor-meetings" element={withLayout(MentorMeeting)} />
          <Route path="/mentees" element={withLayout(MentorTasks)} />

          <Route path="/client-onboarding" element={withLayout(ClientOnboarding)} />
          <Route path="/match-solicitor" element={withLayout(MeetSolicitor)} />

          <Route path="/solicitor-onboarding" element={withLayout(SolicitorOnboarding)} />
          <Route path="/cases" element={withLayout(CaseListPage)} />
          <Route path="/cases/:caseId" element={withLayout(CaseDetailPage)} />
        </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
