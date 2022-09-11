import PlanBenefits from "../../../components/plans/Benefits/planIndex";
import checkAuthentication from "../../../components/utilities/checkAuth/checkAuthentication";

const Plans = () => {
  return <PlanBenefits />;
};

export default checkAuthentication(Plans);
