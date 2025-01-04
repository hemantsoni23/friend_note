import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute({ component: Component }) {
  return Cookies.get('accessToken') ? <Component /> : <Navigate to="/" replace/>;
}

export default PrivateRoute;