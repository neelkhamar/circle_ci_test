import React, { useContext, useEffect, useState } from "react";
import { PageHeader } from "../page-headers/page-headers";
import { Cards } from "../cards/frame/cards-frame";
import { Main } from "./styled";
import { Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import {
  getCompanyDetailById,
  uploadProfileImage,
} from "../../requests/company";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Tabs } from "antd";
import RFCModal from "../Common/Modals/rfcModal";
import { useLoadScript } from "@react-google-maps/api";
import Information from "./information";
import Certificate from "./certificates";
import alertContainer from "../../utils/Alert";
import Swal from "sweetalert2";
import { SocketContext } from "../Layouts/layout/socketContext";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_Google_API_Key,
  libraries: ["places"],
};

function CompanyContainer() {
  const socketContext = useContext(SocketContext);
  const { TabPane } = Tabs;
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [data, setData] = useState({
    inside_number: "",
    legal_name: "",
    name: "",
    logo: undefined,
    certs_flag: undefined,
    outside_number: "",
    rfc: "",
    street: "",
    phone: "",
    website: "",
    tax_system: undefined,
    supportEmail: "",
    country: undefined,
    state: undefined,
    colony: undefined,
    city: undefined,
    postalCode: undefined,
    latitude: undefined,
    longitude: undefined,
    password: "",
  });
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [imageSpinner, setImageSpinner] = useState(false);
  const [visible, setVisible] = useState(false);
  const [taxOptions, setTaxOptions] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [originalPhone, setOriginalPhone] = useState(0);
  const [startSocket, setStartSocket] = useState(false);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });
  const [verified, setVerified] = useState(true);
  const [options, setOptions] = useState({
    country: [],
    state: [],
    city: [],
    colony: [],
    postalCode: [],
  });

  const containerStyle = {
    width: "100%",
    height: "250px",
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getCompanyDetails();
    }

    return () => (mounted = false);
  }, []);

  const optionMapper = ({ id, code, name }) => {
    return { id, code, name };
  };

  const getCompanyDetails = () => {
    setSpinner(true);
    getCompanyDetailById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          if (!response.data || !response.data.rfc) {
            setVisible(true);
          } else {
            const {
              inside_number,
              latitude,
              legal_name,
              longitude,
              name,
              outside_number,
              rfc,
              street,
              email,
              logo,
              phone,
              website,
              certs_flag,
              tax_regimes,
              catalog_colony,
            } = response.data;
            let tax_system = "";
            let catalog = {
              catalog_country: [],
              catalog_state: [],
              catalog_municipality: [],
              catalog_colony: [],
              catalog_postal_code: [],
            };
            if (catalog_colony) {
              catalog.catalog_colony.push(optionMapper(catalog_colony));
            }
            if (catalog_colony.catalog_postal_code) {
              catalog.catalog_postal_code.push(
                optionMapper(catalog_colony.catalog_postal_code)
              );
            }
            if (catalog_colony.catalog_postal_code.catalog_municipality) {
              catalog.catalog_municipality.push(
                optionMapper(
                  catalog_colony.catalog_postal_code.catalog_municipality
                )
              );
            }
            if (
              catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state
            ) {
              catalog.catalog_state.push(
                optionMapper(
                  catalog_colony.catalog_postal_code.catalog_municipality
                    .catalog_state
                )
              );
            }
            if (
              catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.catalog_country
            ) {
              catalog.catalog_country.push(
                optionMapper(
                  catalog_colony.catalog_postal_code.catalog_municipality
                    .catalog_state.catalog_country
                )
              );
            }
            if (tax_regimes.length) {
              tax_system =
                tax_regimes[tax_regimes.length - 1].catalog_tax_regime.id;
            }
            setOptions({
              ...options,
              country: catalog.catalog_country,
              state: catalog.catalog_state,
              city: catalog.catalog_municipality,
              colony: catalog.catalog_colony,
              postalCode: catalog.catalog_postal_code,
            });
            setTaxOptions(tax_regimes);
            setOriginalPhone(phone || 0);
            setData({
              ...data,
              inside_number: inside_number || "",
              legal_name: legal_name || "",
              name: name || "",
              logo: logo || "",
              certs_flag: certs_flag,
              outside_number: outside_number || "",
              rfc: rfc || "",
              street: street || "",
              phone: phone || "",
              website: website || "",
              tax_system: tax_system || "",
              supportEmail: email || "",
              id: response.data.id || "",
              country: catalog.catalog_country[0].id || "",
              state: catalog.catalog_state[0].id || "",
              colony: catalog.catalog_colony[0].id || "",
              city: catalog.catalog_municipality[0].id || "",
              postalCode: catalog.catalog_postal_code[0].id || "",
              latitude: parseFloat(latitude) || "",
              longitude: parseFloat(longitude) || "",
            });
            setVerified(phone ? true : false);
          }
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleOk = () => {
    setVisible(false);
    setStartSocket(true);
  };

  const validateEmail = (value) => {
    let error;
    if (
      value &&
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        value
      )
    ) {
      error = "Introduzca un correo electrónico válido";
    }
    return error;
  };

  const validateWebsite = (value) => {
    let error;
    if (
      value &&
      !/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/i.test(
        value
      )
    ) {
      error = "Introduzca una URL de sitio web válida";
    }
    return error;
  };

  const uploadFile = (file) => {
    setImageSpinner(true);
    let fd = new FormData();
    fd.append("img", file);
    uploadProfileImage(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      fd
    ).then(
      (response) => {
        setImageSpinner(false);
        alertContainer({
          title: response.data.message,
          text: "",
          icon: "success",
          showConfirmButton: false,
        });
        getCompanyDetails();
      },
      (error) => {
        setImageSpinner(false);
      }
    );
  };

  useEffect(() => {
    if (startSocket) {
      Swal.fire({
        title: "Fetching data in progress.",
        text: "",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      Swal.showLoading();
    }
  }, [startSocket]);

  const receiveHandler = (data) => {
    Swal.close();
    setStartSocket(false);
    if (data && data.message) {
      alertContainer({
        title: data.message,
        text: "",
        icon: "success",
        showConfirmButton: false,
      });
      getCompanyDetails();
    } else if (data && data.errors) {
      alertContainer({
        title:
          typeof data.errors == "object" ? data.errors.message : data.errors,
        text: "",
        icon: "error",
        showConfirmButton: false,
      });
      setTimeout(() => {
        setVisible(true);
      }, [1500]);
    }
  };

  return (
    <>
      <PageHeader ghost title="Mi Compañia" buttons={[]} />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {visible ? (
                  <RFCModal visible={visible} handleOk={handleOk} />
                ) : null}
                {spinner ? (
                  <div className="text-center pt-4">
                    <Spin indicator={antIcon} />
                  </div>
                ) : (
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Información" key="1">
                      {startSocket && socketContext ? (
                        <>
                          <socketContext.ActionCableConsumer
                            channel={{
                              channel: "SatAuthenticationChannel",
                            }}
                            onReceived={receiveHandler}
                          />
                        </>
                      ) : null}
                      <Information
                        validateWebsite={validateWebsite}
                        validateEmail={validateEmail}
                        containerStyle={containerStyle}
                        options={options}
                        btnSpinner={btnSpinner}
                        setBtnSpinner={setBtnSpinner}
                        data={data}
                        taxOptions={taxOptions}
                        errorList={errorList}
                        setErrorList={setErrorList}
                        currentUser={currentUser}
                        setOriginalPhone={setOriginalPhone}
                        imageSpinner={imageSpinner}
                        uploadFile={uploadFile}
                        isLoaded={isLoaded}
                        originalPhone={originalPhone}
                        verified={verified}
                        setVerified={setVerified}
                        antIcon={antIcon}
                      />
                    </TabPane>
                    <TabPane tab="Certificados" key="2">
                      <Certificate
                        data={data}
                        currentUser={currentUser}
                        getCompanyDetails={getCompanyDetails}
                      />
                    </TabPane>
                  </Tabs>
                )}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default CompanyContainer;
