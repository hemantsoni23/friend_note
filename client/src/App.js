import React, { lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import PrivateRoutes from "./components/PrivateRoutes";
import { AuthContext } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app flex">
      {user && <Sidebar />}
      <div className={`content ${user ? "flex-1" : "w-full"}`}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<PrivateRoutes><Profile /></PrivateRoutes>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
