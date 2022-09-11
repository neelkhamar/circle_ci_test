import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import { PageHeader } from "../page-headers/page-headers";
import { Cards } from "../cards/frame/cards-frame";
import { Main } from "./styled";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getDashboardData } from "../../requests/dashboard";
import { RatioCard } from "./style";
import Heading from "../heading/heading";
import FeatherIcon from "feather-icons-react";

const Dashboard = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [spinner, setSpinner] = useState(false);
  const [data, setData] = useState({});

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      dashboardData();
    }

    return () => (mounted = false);
  }, []);

  const dashboardData = () => {
    setSpinner(true);
    getDashboardData(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          setData(response.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const verifyAdmin = () => {
    if (
      currentUser &&
      currentUser.roles.length &&
      currentUser.roles.includes("super_admin")
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <PageHeader ghost title="Dashboard" buttons={[]} />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            {/* <Cards headless> */}
            <div style={{ minHeight: "calc(100vh - 320px)" }}>
              {spinner ? (
                <div className="text-center pt-4">
                  <Spin indicator={antIcon} />
                </div>
              ) : (
                <Row gutter={25} className="dashboard">
                  {!verifyAdmin() ? (
                    <>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">CFDI</p>
                                <Heading as="h1" className="success">
                                  {data.cfdis || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder success-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="inbox"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">Fletes</p>
                                <Heading as="h1" className="warning">
                                  {data.freights || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder warning-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="truck"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Vehiculos
                                </p>
                                <Heading as="h1" className="bluish">
                                  {data.vehicles || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder bluish-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="send"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">Income</p>
                                <Heading as="h1" className="danger">
                                  {data.income &&
                                  Object.keys(data.income).length > 0
                                    ? Object.values(data.income)[0]
                                    : 0}
                                </Heading>
                              </div>
                              <div
                                className={
                                  data.income &&
                                  Object.keys(data.income).length > 0
                                    ? "icon-holder-text danger-bg"
                                    : "icon-holder danger-bg"
                                }
                              >
                                <p className="dashboard_currency">
                                  {data.income &&
                                  Object.keys(data.income).length > 0 ? (
                                    Object.keys(data.income)[0]
                                  ) : (
                                    <FeatherIcon
                                      className="color-white"
                                      icon="dollar-sign"
                                      size={34}
                                    />
                                  )}
                                </p>
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Operador
                                </p>
                                <Heading as="h1" className="success">
                                  {data.operators || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder success-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="user"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">Users</p>
                                <Heading as="h1" className="success">
                                  {data.users || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder success-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="user"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Companies
                                </p>
                                <Heading as="h1" className="warning">
                                  {data.companies || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder warning-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="home"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  CFDI (Valid)
                                </p>
                                <Heading as="h1" className="bluish">
                                  {data?.cfdis_valid?.length || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder bluish-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="inbox"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  CFDI (Cancelled)
                                </p>
                                <Heading as="h1" className="danger">
                                  {data?.cfdis_invalid?.length || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder danger-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="inbox"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Fletes with carta-porte CFDI
                                </p>
                                <Heading as="h1" className="success">
                                  {data.moving_notes || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder success-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="truck"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Active Subscriptions
                                </p>
                                <Heading as="h1" className="warning">
                                  {data?.subscriptions_active?.length || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder warning-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="shopping-bag"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Inactive Subscriptions
                                </p>
                                <Heading as="h1" className="bluish">
                                  {data?.subscriptions_inactive?.length || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder bluish-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="shopping-bag"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Income Subscriptions
                                </p>
                                <Heading as="h1" className="danger">
                                  {data.subscriptions_income || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder danger-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="dollar-sign"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Income Prices
                                </p>
                                <Heading as="h1" className="success">
                                  {data.prices_income || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder success-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="dollar-sign"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                      <Col md={8} sm={12} xs={24}>
                        <RatioCard>
                          <Cards headless>
                            <div className="ratio-content d-flex justify-content-between">
                              <div>
                                <p className="dashboard-card-header">
                                  Payments Failed
                                </p>
                                <Heading as="h1" className="warning">
                                  {data.invoices_failed_income || 0}
                                </Heading>
                              </div>
                              <div className="icon-holder warning-bg">
                                <FeatherIcon
                                  className="color-white"
                                  icon="dollar-sign"
                                  size={34}
                                />
                              </div>
                            </div>
                          </Cards>
                        </RatioCard>
                      </Col>
                    </>
                  )}

                  {/* For Admin only */}
                </Row>
              )}
            </div>
            {/* </Cards> */}
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default Dashboard;
