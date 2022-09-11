import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";
import VehicleContainer from "../../components/Vehicle/vehicleContainer";

const Vehicles = () => {
  return <VehicleContainer />;
};

export default checkAuthentication(Vehicles);
