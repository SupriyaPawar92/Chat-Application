
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token and fetch user data
            axios.get('/api/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching user data', error);
                });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        // Fetch user data
        axios.get('/api/auth/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user data', error);
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);