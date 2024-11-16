import { Outlet } from "react-router-dom";
import UserChatComponent from "./UserChatComponent";
import React from "react";

const RoutesWithUserChatComponent = () => {
  return (
    <>
      <UserChatComponent />
      <Outlet />
    </>
  );
};

export default RoutesWithUserChatComponent;
