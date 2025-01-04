import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/user/`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            });
            const data = await res.json();
            setUser(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const login = () => {
        fetchUser();
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('accessToken');  
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;