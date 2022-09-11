import React from "react";
import IngresoContainer from "../../components/CFDI/ingresoContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Ingreso = () => {
  return <IngresoContainer />;
};

export default checkAuthentication(Ingreso);
