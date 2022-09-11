import React from "react";
import CatalogsContainer from "../../components/Settings/catalogsContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Catalogs = () => {
  return <CatalogsContainer />;
};

export default checkAuthentication(Catalogs);
