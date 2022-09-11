import dynamic from "next/dynamic";
import React from "react";
// import CompanyContainer from '../../components/Company/companyContainer';
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Company = () => {
  const CompanyContainer = dynamic(
    () => import("../../components/Company/companyContainer"),
    { ssr: false }
  );

  return <CompanyContainer />;
};

export default checkAuthentication(Company);
