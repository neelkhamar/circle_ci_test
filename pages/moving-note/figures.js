import EntityContainer from "../../components/Entities/entitiesContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Entities = () => {
  return <EntityContainer />;
};

export default checkAuthentication(Entities);
