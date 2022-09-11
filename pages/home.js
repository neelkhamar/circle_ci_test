import React from "react";
import Dashboard from "../components/Dashboard/dashboard";
import checkAuthentication from "../components/utilities/checkAuth/checkAuthentication";

const Home = () => {
  return <Dashboard />;
};

export default checkAuthentication(Home);
