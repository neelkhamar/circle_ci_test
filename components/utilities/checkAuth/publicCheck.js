import React from "react";
import Router from "next/router";
import { useSelector } from "react-redux";

const publicCheck = (WrappedComponent) => (props) => {
  const { loggedIn } = useSelector((state) => {
    const currentUser = state.auth.currentUser;
    return {
      loggedIn:
        currentUser.uid && currentUser.accessToken && currentUser.client
          ? true
          : false,
    };
  });
  if (!loggedIn) {
    return <WrappedComponent {...props} />;
  } else {
    Router.replace("/home");
    return false;
  }
};

export default publicCheck;
