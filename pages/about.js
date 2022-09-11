import React, { Component } from "react";
import NavbarTwo from "../components/Layouts/NavbarTwo";
import PageTitleArea from "../components/Common/PageTitleArea";
import AboutContent from "../components/About/AboutContent";
import DownloadApp from "../components/Common/DownloadApp";
import Footer from "../components/Layouts/Footer";
import publicCheck from "../components/utilities/checkAuth/publicCheck";

class About extends Component {
  render() {
    return (
      <>
        <NavbarTwo />
        <PageTitleArea pageTitle="About Us" pageDescription="The Hepro Story" />
        <AboutContent />

        <DownloadApp />
        <Footer />
      </>
    );
  }
}

export default publicCheck(About);
