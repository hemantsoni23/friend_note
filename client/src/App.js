import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./pages/Profile";
import { AuthContext } from "./context/AuthContext";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app flex">
      {user && <Sidebar />}
      <div className={`content ${user ? "flex-1" : "w-full"}`}>
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<PrivateRoutes component={<Profile/>} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </div>
    </div>
  );
}

export default App;
