import React from "react";
import PreviewContainer from "../../../components/Flete/previewContainer";
import checkAuthentication from "../../../components/utilities/checkAuth/checkAuthentication";

const Preview = () => {
  return <PreviewContainer />;
};

export default checkAuthentication(Preview);
