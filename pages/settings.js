import React from "react";
import SettingContainer from "../components/UserSetting/setting_container";
import checkAuthentication from "../components/utilities/checkAuth/checkAuthentication";

const Settings = () => {
  return <SettingContainer />;
};

export default checkAuthentication(Settings);
