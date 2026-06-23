import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Since login is temporarily removed, we use a permanent guest session.
// All features are accessible without authentication.
const GUEST_USER = {
    name: 'Guest User',
    email: 'guest@hiresense.ai',
    avatar: 'G',
};

export const AuthProvider = ({ children }) => {
    const [user] = useState(GUEST_USER);

    const logout = () => {
        // No-op for now since auth is disabled
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
