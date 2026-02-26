import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResumeIntelligence from './pages/ResumeIntelligence';
import MockInterviewSetup from './pages/MockInterviewSetup';
import MockInterviewSession from './pages/MockInterviewSession';
import Landing from './pages/Landing';

// Professional Light Placeholder
const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in duration-700">
    <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-indigo-100/50">
      <span className="text-5xl drop-shadow-sm">≡ƒÅù∩╕Å</span>
    </div>
    <div className="space-y-4">
      <div className="inline-flex items-center px-4 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Module Under Construction</div>
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
      <p className="text-gray-500 max-w-lg text-lg font-medium leading-relaxed">
        Our engineers are currently stabilizing the <span className="text-indigo-600 font-bold">{title}</span> layer. Detailed career telemetry and predictive intelligence protocols will be available shortly.
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeIntelligence />} />
        <Route path="/company" element={<Placeholder title="Company Scan" />} />
        <Route path="/mock-interview/setup" element={<MockInterviewSetup />} />
        <Route path="/mock-interview/session" element={<MockInterviewSession />} />
        <Route path="/performance" element={<Placeholder title="Growth Metrics" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
