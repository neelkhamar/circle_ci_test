import React from "react";
import Router from "next/router";
import { useSelector } from "react-redux";

const checkAuthentication = (WrappedComponent) => (props) => {
  const { loggedIn } = useSelector((state) => {
    const currentUser = state.auth.currentUser;
    return {
      loggedIn:
        currentUser.uid && currentUser.accessToken && currentUser.client
          ? true
          : false,
    };
  });

  if (loggedIn) {
    return <WrappedComponent {...props} />;
  } else {
    Router.replace("/login");
    return false;
  }
};

export default checkAuthentication;
