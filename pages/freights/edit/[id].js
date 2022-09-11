import React, { useEffect } from "react";
import FleteContainer from "../../../components/Flete/fleteContainer";
import checkAuthentication from "../../../components/utilities/checkAuth/checkAuthentication";

const Fletes = () => {
  return <FleteContainer />;
};

export default checkAuthentication(Fletes);
