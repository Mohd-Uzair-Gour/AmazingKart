import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState(undefined);

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const { data } = await axios.get("/api/get-token");
        if (data.token) {
          setIsAuth(data.token);  
        } else {
          setIsAuth(null); // Set to null if no token is found
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsAuth(null); // Set to null if unauthorized
        }
      }
    };
    fetchAuthToken();
  }, []); // Run only once on component mount

  if (isAuth === undefined) return <LoginPage />;

  return isAuth && admin && isAuth !== "admin" ? (
    <Navigate to="/login" />
  ) : isAuth && admin ? (
    <Outlet />
  ) : isAuth && !admin ? (
    <>
      <UserChatComponent />
      <Outlet />
    </>
  ) : ( 
    <Navigate to="/login" />
  );
};

export default ProtectedRoutesComponent;
