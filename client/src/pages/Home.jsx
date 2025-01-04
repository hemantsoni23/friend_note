import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthView = () => {
    setIsLogin((prevState) => !prevState);
  };

  if (user) {
    return (
      <div className="home-page flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-blue-100 to-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">Welcome to FriendNote</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 text-center">
          Connect with your friends and explore recommendations effortlessly.
        </p>
      </div>
    );
  }

  return (
    <div className="home-page grid grid-cols-1 md:grid-cols-2 min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">FriendNote</h1>
        <p className="text-lg md:text-xl">
          Your hub for connecting with friends and discovering new ones.
        </p>
      </div>
      <div className="flex justify-center items-center bg-white p-8">
        {isLogin ? <Login toggleAuthView={toggleAuthView} /> : <SignUp toggleAuthView={toggleAuthView} />}
      </div>
    </div>
  );
};

export default Home;
