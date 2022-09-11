import React from "react";
import CFDIDetail from "../../components/CFDI/cfdiDetail";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const CartaPorte = () => {
  return <CFDIDetail />;
};

export default checkAuthentication(CartaPorte);
