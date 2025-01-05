import React, { lazy, Suspense, useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import PrivateRoutes from "./components/PrivateRoutes";
import { AuthContext } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const Search = lazy(() => import("./pages/Search"));
const Friends = lazy(() => import("./pages/Friends"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage"));

function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <div className="app flex flex-col lg:flex-row min-h-screen">
      {user && <Sidebar />}
      <div className="content w-full">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<PrivateRoutes><Profile /></PrivateRoutes>} />
            <Route path="/search" element={<PrivateRoutes><Search /></PrivateRoutes>} />
            <Route path="/recommendations" element={<PrivateRoutes><RecommendationsPage /></PrivateRoutes>} />
            <Route path="/friends" element={<PrivateRoutes><Friends /></PrivateRoutes>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
