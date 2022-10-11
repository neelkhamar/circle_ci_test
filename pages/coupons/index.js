import CouponIndex from "../../components/coupons/CouponIndex";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Coupons = () => {
  console.log("Test works");
  return <CouponIndex />;
};

export default checkAuthentication(Coupons);
