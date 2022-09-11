import SubscriptionSettingsContainer from "../../components/subscription/SubscriptionSettings";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const SubscriptionSettings = () => {
  return <SubscriptionSettingsContainer />;
};

export default checkAuthentication(SubscriptionSettings);
