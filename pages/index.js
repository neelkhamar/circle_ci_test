import WhyChooseUs from "../components/Common/WhyChooseUs";
import ContactFormArea from "../components/Contact/ContactFormArea";
import Features from "../components/HomeSaas/Features";
import MainBanner from "../components/HomeSaas/MainBanner";
import Footer from "../components/Layouts/Footer";
import NavbarTwo from "../components/Layouts/NavbarTwo";
import Pricing from "../components/Pricing/Pricing";
import publicCheck from "../components/utilities/checkAuth/publicCheck";

const Index = () => {
  return (
    <>
      <NavbarTwo />
      <MainBanner />
      <Features />
      <WhyChooseUs />
      <Pricing />
      <ContactFormArea />
      <Footer />
    </>
  );
};

export default publicCheck(Index);
