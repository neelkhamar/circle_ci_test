import "../public/static/css/style.css";
import "antd/dist/antd.css";
import "../styles/bootstrap.min.css";
import "../styles/animate.min.css";
import "../styles/boxicons.min.css";
import "react-accessible-accordion/dist/fancy-example.css";
import "../node_modules/react-modal-video/css/modal-video.min.css";
import "../styles/style.css";
import "../styles/responsive.css";

import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/configureStore";
import Head from "next/head";
import GoTop from "../components/Shared/GoTop";
import { PersistGate } from "redux-persist/integration/react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ThemeLayout from "../components/Layouts/layout/withAdminLayout";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <title>Porteton - CFDI, Carta Porte</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <meta
              name="description"
              content="CFDI con complemento Carta Porte "
            />
            <meta name="og:title" property="og:title" content="Porteton"></meta>
            <meta
              name="twitter:card"
              content="Hepro - React Next IT & SaaS Startup Template"
            ></meta>
            <link
              rel="canonical"
              href="https://hepro-react.envytheme.com/"
            ></link>
          </Head>

          <ThemeLayout>
            <Component {...pageProps} />
          </ThemeLayout>

          {/* Go Top Button */}
          <GoTop scrollStepInPx="100" delayInMs="10.50" />
        </PersistGate>
      </Provider>
    );
  }
}
