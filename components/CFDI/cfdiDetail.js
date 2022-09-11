import { CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  // FormGroup,
  Col,
  Row,
} from "reactstrap";
import { getCFDIData } from "../../requests/cfdi";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import { PageHeader } from "../page-headers/page-headers";
import Cliente from "./sections/cliente";
import Detail from "./sections/detail";
import { Main } from "./styled";

const CFDIDetail = () => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [selectedCartaPorte, setSelectedCartaPorte] = useState(null);
  const { Panel } = Collapse;
  const [spinner, setSpinner] = useState(false);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getData();
    }

    return () => (mounted = false);
  }, []);

  const getData = () => {
    setSpinner(true);
    const cartaPorte = JSON.parse(localStorage.getItem("selectedCartaPorte"));
    if (!cartaPorte) {
      routeBack();
      return false;
    }
    setSelectedCartaPorte(cartaPorte);
    getCFDIData(
      currentUser.accessToken,
      currentUser.client,
      currentUser.uid
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          setState(response.data.data);
        }
      },
      (err) => {
        setSpinner(false);
      }
    );
  };

  const routeBack = () => {
    router.push("/cfdi/");
  };

  return (
    <>
      <PageHeader
        ghost
        title="CFDI"
        subTitle="Carte Porte"
        buttons={[
          <div key="6" className="page-header-actions">
            <Button size="small" key="4" type="primary" onClick={routeBack}>
              <FeatherIcon icon="arrow-left" size={14} />
              Back
            </Button>
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {spinner ? (
                  <div className="text-center pt-4">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <>
                    <Collapse
                      bordered={false}
                      defaultActiveKey={["1"]}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined
                          style={{ fontSize: "15px" }}
                          rotate={isActive ? 90 : 0}
                        />
                      )}
                      className="site-collapse-custom-collapse"
                    >
                      <Panel
                        header="Details"
                        key="1"
                        className="site-collapse-custom-panel"
                      >
                        <Detail
                          data={state?.info}
                          selectedCartaPorte={selectedCartaPorte}
                        />
                      </Panel>
                      <Panel
                        header="Cliente"
                        key="2"
                        className="site-collapse-custom-panel"
                      >
                        <Cliente
                          data={state?.info}
                          selectedCartaPorte={selectedCartaPorte}
                        />
                      </Panel>
                      <Panel
                        header="Products"
                        key="3"
                        className="site-collapse-custom-panel"
                      >
                        <p>Product Listing</p>
                      </Panel>
                    </Collapse>
                  </>
                )}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default CFDIDetail;
