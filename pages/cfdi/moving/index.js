import React from "react";
import TransladoContainer from "../../../components/CFDI/transladoContainer";
import checkAuthentication from "../../../components/utilities/checkAuth/checkAuthentication";

const Translado = () => {
  return <TransladoContainer />;
};

export default checkAuthentication(Translado);
