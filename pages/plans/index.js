import PlanIndex from "../../components/plans/PlanIndex";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Plans = () => {
  return <PlanIndex />;
};

export default checkAuthentication(Plans);
