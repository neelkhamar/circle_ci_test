import React, { Component } from "react";
import NavbarTwo from "../components/Layouts/NavbarTwo";
import PageTitleArea from "../components/Common/PageTitleArea";
import ContactFormArea from "../components/Contact/ContactFormArea";
import Footer from "../components/Layouts/Footer";
import publicCheck from "../components/utilities/checkAuth/publicCheck";

class Contact extends Component {
  render() {
    return (
      <>
        <NavbarTwo />

        <PageTitleArea
          pageTitle="Contact Us"
          pageDescription="Drop us Message for any Query"
        />

        <ContactFormArea />

        <Footer />
      </>
    );
  }
}

export default publicCheck(Contact);
