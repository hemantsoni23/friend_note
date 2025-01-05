import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useSettings = () => {
  const { logout: authLogout } = useContext(AuthContext);

  const toggleTheme = () => {
    const body = document.body;
    const isDarkMode = body.classList.toggle("dark"); 
    localStorage.setItem("theme", isDarkMode ? "dark" : "light"); 
  };

  const logoutUser = () => {
    authLogout(); 
    window.location.href = '/'; 
  };

  return { toggleTheme, logoutUser };
};
