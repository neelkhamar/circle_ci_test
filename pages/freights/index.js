import React from "react";
import FleteIndex from "../../components/Flete/fleteIndex";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Fletes = () => {
  return <FleteIndex />;
};

export default checkAuthentication(Fletes);
