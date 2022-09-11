/* eslint-disable no-shadow */
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import {
  getFcmToken,
  onMessageListener,
} from "../../../components/utilities/auth/firebase";
import config from "../../../config/config";
import { createNotification } from "../../../redux/notification/actionCreator";
import LayoutComponent from "./ChildComponent";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { WS_URL } from "../../../apis/constants";
import { SocketContext } from "./socketContext";

const { theme } = config;

const ThemeLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addLayout, setAddLayout] = useState(true);
  const [token_found, setTokenFound] = useState(false);
  const { rtl, topMenu, darkMode, loggedIn, currentUser } = useSelector(
    (state) => {
      return {
        darkMode: state.ChangeLayoutMode.data,
        rtl: state.ChangeLayoutMode.rtlData,
        topMenu: state.ChangeLayoutMode.topMenu,
        loggedIn:
          state.auth.currentUser.uid &&
          state.auth.currentUser.accessToken &&
          state.auth.currentUser.client
            ? true
            : false,
        currentUser: state.auth.currentUser,
      };
    }
  );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (router.route.includes("/freights/preview")) {
        setAddLayout(false);
      } else {
        setAddLayout(true);
      }
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (loggedIn && !token_found) {
      getFcmToken(currentUser, setTokenFound);
    }
  }, [token_found]);

  onMessageListener().then((payload) => {
    dispatch(createNotification(payload.data));
  });

  const ActionCableProvider = dynamic(() => {
    return import("react-actioncable-provider").then(
      (item) => item.ActionCableProvider
    );
  });

  const ActionCableConsumer = dynamic(() => {
    return import("react-actioncable-provider").then(
      (item) => item.ActionCableConsumer
    );
  });

  return (
    <>
      {loggedIn && addLayout ? (
        <BrowserRouter>
          <ConfigProvider direction={rtl ? "rtl" : "ltr"}>
            <ThemeProvider theme={{ ...theme, rtl, topMenu, darkMode }}>
              {ActionCableProvider && ActionCableConsumer ? (
                <ActionCableProvider
                  url={`${WS_URL}?id=${
                    JSON.parse(currentUser.userDetails).id
                  }&client=${currentUser.client}&access_token=${
                    currentUser.accessToken
                  }`}
                >
                  <SocketContext.Provider value={{ ActionCableConsumer }}>
                    <LayoutComponent children={children} />
                  </SocketContext.Provider>
                </ActionCableProvider>
              ) : (
                <></>
              )}
            </ThemeProvider>
          </ConfigProvider>
        </BrowserRouter>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
export default ThemeLayout;
