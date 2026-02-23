import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResumeIntelligence from './pages/ResumeIntelligence';
import MockInterviewSetup from './pages/MockInterviewSetup';
import MockInterviewSession from './pages/MockInterviewSession';

// Mock Placeholders
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
    <p className="text-slate-500 mt-4 max-w-lg text-lg">
      This module is currently under construction. Please check back later for the implementation of {title.toLowerCase()}.
    </p>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeIntelligence />} />
        <Route path="/company" element={<Placeholder title="Company Assessment" />} />
        <Route path="/mock-interview/setup" element={<MockInterviewSetup />} />
        <Route path="/mock-interview/session" element={<MockInterviewSession />} />
        <Route path="/performance" element={<Placeholder title="Performance History" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
