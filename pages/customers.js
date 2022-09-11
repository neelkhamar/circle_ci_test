import React from "react";
import ClientContainer from "../components/Clients/clientContainer";
import checkAuthentication from "../components/utilities/checkAuth/checkAuthentication";

const Clientes = () => {
  return <ClientContainer />;
};

export default checkAuthentication(Clientes);
