import dynamic from "next/dynamic";
import React from "react";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Vehicles = () => {
  const CFDIContainer = dynamic(
    () => import("../../components/CFDI/cfdiContainer"),
    { ssr: false }
  );

  return <CFDIContainer />;
};

export default checkAuthentication(Vehicles);
