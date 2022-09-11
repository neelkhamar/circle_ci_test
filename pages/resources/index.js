import React from "react";
import ResourceIndex from "../../components/resources/ResourceIndex";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Resources = () => {
  return <ResourceIndex />;
};

export default checkAuthentication(Resources);
