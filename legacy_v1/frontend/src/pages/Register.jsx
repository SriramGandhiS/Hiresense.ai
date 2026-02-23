import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role || 'user');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 border-t-4 border-emerald-500 relative">
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 z-10">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
                    </div>
                    <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/30">
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Login</Link>
                </p>
            </div>

            {/* Persistent Watermark as requested */}
            <div className="fixed bottom-4 right-4 z-50 pointer-events-none opacity-20 user-select-none">
                <span className="text-2xl font-bold tracking-widest text-slate-400 filter drop-shadow-md">HireSense AI</span>
            </div>
        </div>
    );
};

export default Register;
