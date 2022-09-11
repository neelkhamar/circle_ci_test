import PolicyContainer from "../../components/Policy/policyContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Policy = () => {
  return <PolicyContainer />;
};

export default checkAuthentication(Policy);
