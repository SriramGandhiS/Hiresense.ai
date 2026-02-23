import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import InterviewEngine from './pages/InterviewEngine';
import Admin from './pages/Admin';

gsap.registerPlugin(ScrollTrigger);

const ProtectedRoute = ({ children, adminOnly }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return <Navigate to="/login" replace />;
    if (adminOnly && role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

// Lenis smooth scrolling wrapper
const SmoothScrollWrapper = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            direction: 'vertical',
            gestureDirection: 'vertical',
        });

        // Tie GSAP ScrollTrigger to Lenis scroll for perfectly synced animations
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <SmoothScrollWrapper>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                        <Route path="interview-engine" element={<ProtectedRoute><InterviewEngine /></ProtectedRoute>} />
                        <Route path="admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </SmoothScrollWrapper>
        </BrowserRouter>
    );
}

export default App;
