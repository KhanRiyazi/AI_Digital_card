import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthStatus, setAuthStatus } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsAuthenticated(getAuthStatus());
        setLoading(false);
    }, []);

    const login = (email, password) => {
        if (email === 'principal@school.edu' && password === 'admin123') {
            setAuthStatus(true);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setAuthStatus(false);
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner w-8 h-8"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};