import PriceContainer from "../../components/prices/priceContainer";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Prices = () => {
  return <PriceContainer />;
};

export default checkAuthentication(Prices);
