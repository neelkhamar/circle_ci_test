import LocationContainer from "../../components/Location/locationContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Location = () => {
  return <LocationContainer />;
};

export default checkAuthentication(Location);
