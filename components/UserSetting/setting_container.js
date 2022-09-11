import React, { Suspense, useState, useEffect } from "react";
import { Row, Col, Skeleton } from "antd";
import { PageHeader } from "../page-headers/page-headers";
import { Cards } from "../cards/frame/cards-frame";
import { Main, SettingWrapper } from "./styled";
import AuthorBox from "./author_box";
import Profile from "../UserProfile/profile";
import Account from "../UserAccount/account";
import Password from "../UserPassword/password";
import Notification from "../UserNotification/notification";
import { useSelector } from "react-redux";

const SettingContainer = () => {
  const { currentProfileTab } = useSelector((state) => {
    return {
      currentProfileTab: state.ChangeLayoutMode.profileCurrentTab,
    };
  });

  return (
    <>
      <PageHeader ghost title="Configuracion del Perfil" />
      <Main>
        <Row gutter={25}>
          <Col xxl={6} lg={8} md={10} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton avatar />
                </Cards>
              }
            >
              <AuthorBox />
            </Suspense>
          </Col>
          <Col xxl={18} lg={16} md={14} xs={24}>
            <SettingWrapper>
              <Suspense
                fallback={
                  <Cards headless>
                    <Skeleton avatar />
                  </Cards>
                }
              >
                {currentProfileTab == 1 ? <Profile /> : ""}
                {currentProfileTab == 2 ? <Account /> : ""}
                {/* {currentProfileTab == 3 ? <Password /> : ''} */}
                {currentProfileTab == 4 ? <Notification /> : ""}
              </Suspense>
            </SettingWrapper>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default SettingContainer;
