import React from "react";
import ResourceActionIndex from "../../../components/resources/ResourceActionIndex";
import checkAuthentication from "../../../components/utilities/checkAuth/checkAuthentication";

const ResourceActions = () => {
  return <ResourceActionIndex />;
};

export default checkAuthentication(ResourceActions);
