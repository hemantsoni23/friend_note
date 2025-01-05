import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken && !user) {
            fetchUser();
        }
    }, [user]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_ROUTE}/api/users/`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            handleSetUser(res.data);
        }
        catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                logout();
            }
        }
    }

    const login = () => {
        fetchUser();
    };

    const refreshUser = (updatedUser) => {
        if (updatedUser) {
            setUser(updatedUser);
        } else {
            fetchUser();
        }
    };


    const logout = () => {
        setUser(null);
        Cookies.remove('accessToken');  
    };

    const handleSetUser = (user) => {
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ user, handleSetUser, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;