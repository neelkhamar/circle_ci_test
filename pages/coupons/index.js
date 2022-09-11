import CouponIndex from "../../components/coupons/CouponIndex";
import checkAuthentication from "../../components/utilities/checkAuth/checkAuthentication";

const Coupons = () => {
  return <CouponIndex />;
};

export default checkAuthentication(Coupons);
