import SCTContainer from "../../components/Sct/sctContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const SCT = () => {
  return <SCTContainer />;
};

export default checkAuthentication(SCT);
