import { LoadingOutlined } from "@ant-design/icons";
import { useLoadScript } from "@react-google-maps/api";
import { Button, Modal, Spin, Tabs } from "antd";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import {
  getCityList,
  getColonyList,
  getCountryList,
  getCurp,
  getFigureById,
  getLatLong,
  getPostalCodeList,
  getStateList,
  saveFigure,
  updateFigure,
  validateRFCValue,
} from "../../../../requests/carta-porte";
import alertContainer from "../../../../utils/Alert";
import AddressForm from "./addressForm";
import FigureForm from "./figureForm";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_Google_API_Key,
  libraries: ["places"],
};

function EntityModal(props) {
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const { TabPane } = Tabs;
  const { visible, handleCancel, handleOk, selectedFigure } = props;
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [globalSpinner, setGlobalSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [currentTab, setCurrentTab] = useState(1);
  const typeOptions = [
    { value: 0, label: "Operador" },
    { value: 1, label: "Propietario" },
    { value: 2, label: "Arrendatario" },
  ];
  const btnValues = {
    0: "Operador",
    1: "Propietario",
    2: "Arrendatario",
  };

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
    selected: false,
    isManual: false,
    address: "",
    country: "",
    state: "",
    city: "",
    colony: "",
    postalCode: "",
    street: "",
    insideNumber: "",
    outsideNumber: "",
    street1: "",
    insideNumber1: "",
    outsideNumber1: "",
    disableOutsideNumber: false,
    curp: "",
    name: "",
    last_name: "",
    second_last_name: "",
    gender: "",
    birthday: "",
    type: 0,
    license_number: "",
    rfc: "",
  });
  const [countryOption, setCountryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);
  const [postalCodeOption, setPostalCodeOption] = useState([]);
  const [colonyOption, setColonyOption] = useState([]);
  const [errorList, setErrorList] = useState([]);

  const [isManual, setIsManual] = useState(false);

  const [isValid, setIsValid] = useState(false);

  const [curpError, setCurpError] = useState(false);
  const inputHandler = (key, value) => {
    setLocation({
      ...location,
      [key]: value,
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (selectedFigure) {
        getOneFigure();
      } else {
        getCountries();
      }
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (location.colony) {
      showError("");
    }
  }, [location.colony]);

  const getOneFigure = () => {
    setGlobalSpinner(true);
    getFigureById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      selectedFigure
    ).then(
      async (response) => {
        setGlobalSpinner(false);
        if (response.status === 200) {
          let resp = response.data;
          if (!resp.address) {
            await Promise.all([
              getCountries(true),
              getSelectOptions(
                "state",
                resp.catalog_colony.catalog_postal_code.catalog_municipality
                  .catalog_state.catalog_country.id,
                true
              ),
              getSelectOptions(
                "city",
                resp.catalog_colony.catalog_postal_code.catalog_municipality
                  .catalog_state.id,
                true
              ),
              getSelectOptions(
                "postalCode",
                resp.catalog_colony.catalog_postal_code.catalog_municipality.id,
                true
              ),
              getSelectOptions(
                "colony",
                resp.catalog_colony.catalog_postal_code.id,
                true
              ),
            ]);
          }
          setIsManual(true);
          const dateValues = resp.birthday.split("T")[0].split("-");
          setLocation({
            ...location,
            lat: parseFloat(resp.latitude),
            lng: parseFloat(resp.longitude),
            isManual: !resp.address,
            address: resp.address,
            country:
              resp.catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.catalog_country.id,
            selected: true,
            state:
              resp.catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.id,
            city: resp.catalog_colony.catalog_postal_code.catalog_municipality
              .id,
            colony: !resp.address
              ? resp.catalog_colony.id + "/" + resp.catalog_colony.name
              : resp.catalog_colony.id,
            postalCode: resp.catalog_colony.catalog_postal_code.id,
            street: resp.street,
            street1: resp.street,
            insideNumber1: resp.inside_number || "",
            insideNumber: resp.inside_number || "",
            outsideNumber1: resp.outside_number,
            outsideNumber: resp.outside_number,
            isValidated: true,
            disableOutsideNumber: true,
            curp: resp.curp,
            name: resp.name,
            last_name: resp.last_name,
            second_last_name: resp.second_last_name,
            gender: resp.gender,
            // Getting YYYY-MM-DD from API, changing it to MM/DD/YYYY
            birthday: moment(
              `${dateValues[1]}/${dateValues[2]}/${dateValues[0]}`
              // `${dateValues[1]}/${dateValues[0]}/${dateValues[2]}`
            ),
            type: 0,
            license_number: resp.license_number,
            rfc: resp.rfc,
          });
        }
      },
      (error) => {
        setGlobalSpinner(false);
      }
    );
  };

  const resetValues = () => {
    setIsValid(false);
    setLocation({
      ...location,
      curp: "",
      name: "",
      last_name: "",
      second_last_name: "",
      gender: "",
      birthday: "",
      type: 0,
      license_number: "",
      rfc: "",
    });
    showError("");
  };

  const getSelectOptions = (key, id) => {
    if (key === "state") {
      getStateList(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      ).then(
        (resp) => {
          if (resp.status === 200) {
            setStateOption(resp.data.data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (key === "city") {
      getCityList(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      ).then(
        (resp) => {
          if (resp.status === 200) {
            setCityOption(resp.data.data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (key === "postalCode") {
      getPostalCodeList(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      ).then(
        (resp) => {
          if (resp.status === 200) {
            setPostalCodeOption(resp.data.data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (key === "colony") {
      getColonyList(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      ).then(
        (resp) => {
          if (resp.status === 200) {
            setColonyOption(resp.data.data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const handleVerify = (values) => {
    let country = countryOption.find((val) => val.id === values.country);
    let address = `${values.colony.split("/")[1]}, ${values.postalCode}, ${
      values.state
    }, ${country.name}`;
    setBtnSpinner(true);
    getLatLong(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      address.replaceAll(" ", "+")
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 200 && response.data.data.length > 0) {
          let { lat, lng } = response.data.data[0].geometry.location;
          setLocation({
            ...values,
            lat: lat,
            lng: lng,
            isValidated: true,
          });
        } else {
          setErrorList(["Something went wrong, try again later"]);
        }
      },
      (error) => {
        setBtnSpinner(false);
      }
    );
  };

  const getCountries = () => {
    setGlobalSpinner(true);
    getCountryList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setGlobalSpinner(false);
        if (response.status === 200 && response.data.data) {
          setCountryOption(response.data.data);
        }
      },
      (error) => {
        setGlobalSpinner(false);
      }
    );
  };

  const resetAddressValues = () => {
    setLocation({
      ...location,
      lat: "",
      lng: "",
      selected: false,
      address: "",
      country: "",
      state: "",
      city: "",
      colony: "",
      postalCode: "",
      street: "",
      insideNumber: "",
      outsideNumber: "",
      street1: "",
      insideNumber1: "",
      outsideNumber1: "",
      disableOutsideNumber: false,
    });
    setErrorList([]);
  };

  const fetchCurp = (curp) => {
    setSpinner(true);
    setIsValid(true);
    setCurpError(false);
    getCurp(
      curp,
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data.data) {
          const { birthDate, name, paternalName, maternalName, sex, curp } =
            response.data.data;
          let dateValues = birthDate.split("-");
          setLocation({
            ...location,
            name: name || "",
            last_name: paternalName || "",
            second_last_name: maternalName || "",
            gender: sex || "",
            birthday:
              moment(`${dateValues[1]}/${dateValues[2]}/${dateValues[0]}`) ||
              "",
            curp: curp || "",
          });
        }
      },
      (error) => {
        setIsValid(false);
        setCurpError(true);
        setSpinner(false);
      }
    );
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const handleSave = (values) => {
    setBtnSpinner(true);
    let payload = {
      name: values.name,
      last_name: values.last_name,
      second_last_name: values.second_last_name,
      gender: values.gender,
      curp: values.curp,
      birthday: values.birthday,
      kind: parseInt(values.type),
      rfc: values.rfc,
      license_number: values.license_number,
      longitude: location.lng,
      latitude: location.lat,
      address: location.address,
      street: location.isManual ? values.street : values.street1,
      inside_number: location.isManual
        ? values.insideNumber
        : values.insideNumber1,
      outside_number: location.isManual
        ? values.outsideNumber
        : values.outsideNumber1,
      catalog_colony_id: location.isManual
        ? values.colony.split("/")[0]
        : values.colony,
    };
    showError("");
    if (selectedFigure) {
      updateFigure(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload,
        selectedFigure
      ).then(
        (response) => {
          setBtnSpinner(false);
          console.log(response);
          if (response.status === 200 && response.data.message) {
            alertContainer({
              title: response.data.message,
              text: "",
              icon: "success",
              showConfirmButton: false,
            });
            handleOk();
          }
        },
        (error) => {
          setBtnSpinner(false);
        }
      );
    } else {
      saveFigure(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      ).then(
        (response) => {
          setBtnSpinner(false);
          if (response.status === 201 && response.data.message) {
            alertContainer({
              title: response.data.message,
              text: "",
              icon: "success",
              showConfirmButton: false,
            });
            handleOk();
          }
        },
        (error) => {
          if (error.response.status === 422) {
            showError(
              error.response.data.errors.length
                ? error.response.data.errors[0]
                : "Company has already been taken"
            );
          }
          setBtnSpinner(false);
        }
      );
    }
  };

  const checkRFC = async (rfc) => {
    setBtnSpinner(true);
    let result = await validateRFCValue(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      rfc
    );
    setBtnSpinner(false);
    if (result.status === 200) {
      return result.data.data.isValid;
    } else {
      return false;
    }
  };

  return (
    <Modal
      className="entityModalContainer"
      title={selectedFigure ? "Actualizada Figura" : "Nueva Figura"}
      visible={visible}
      onOk={handleOk}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[]}
    >
      <Formik
        initialValues={location}
        enableReinitialize={true}
        validationSchema={() =>
          Yup.lazy((values) => {
            let validate = {
              curp: Yup.string()
                .min(18, "El curp no puede tener menos de 18 caracteres!")
                .required("Se requiere la curp"),
              type: Yup.string().required("Se requiere la tipo"),
              rfc: Yup.string().required("Se requiere la RFC"),
              license_number: Yup.string()
                .required("Se requiere la Licencia de manejo")
                .max(
                  100,
                  "Licencia de manejo no debe exceder más de 100 caracteres"
                ),
            };
            if (isManual) {
              validate["name"] = Yup.string()
                .required("Se requiere la Nombre")
                .min(3, "La Nombre debe tener más de 3 caracteres")
                .max(100, "La Nombre debe tener menos de 100 caracteres");
              validate["last_name"] = Yup.string()
                .required("Se requiere la Paterno")
                .min(3, "La Paterno debe tener más de 3 caracteres")
                .max(100, "La Paterno debe tener menos de 100 caracteres");
              validate["second_last_name"] = Yup.string()
                .required("Se requiere la Materno")
                .min(3, "La Materno debe tener más de 3 caracteres")
                .max(100, "La Materno debe tener menos de 100 caracteres");
              validate["gender"] = Yup.string().required("Se requiere la Sexo");
              validate["birthday"] = Yup.string().required(
                "Se requiere la Nacimiento"
              );
            }
            return Yup.object().shape(validate);
          })
        }
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          setStatus();
          if (!values.colony) {
            showError("La direccion es requerida.");
          } else {
            showError("");
            if (location.isManual) {
              if (location.isValidated) {
                let isValid = await checkRFC(values.rfc);
                if (isValid) {
                  handleSave(values);
                } else {
                  showError("Invalid RFC. Please enter a valid RFC");
                }
              } else {
                handleVerify(values);
              }
            } else {
              let isValid = await checkRFC(values.rfc);
              if (isValid) {
                handleSave(values);
              } else {
                showError("Invalid RFC. Please enter a valid RFC");
              }
            }
          }
        }}
        render={({
          errors,
          status,
          touched,
          values,
          handleBlur,
          handleChange,
        }) => (
          <Form>
            <>
              {globalSpinner ? (
                <div className="text-center pt-4">
                  <Spin indicator={antIcon} />
                </div>
              ) : (
                <Tabs
                  defaultActiveKey={currentTab}
                  onChange={(val) => setCurrentTab(val)}
                >
                  <TabPane tab="Figura" key={1}>
                    <FigureForm
                      selectedFigure={selectedFigure}
                      setIsManual={setIsManual}
                      isManual={isManual}
                      typeOptions={typeOptions}
                      isValid={isValid}
                      resetValues={resetValues}
                      data={location}
                      setData={setLocation}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      errors={errors}
                      touched={touched}
                      curpError={curpError}
                      values={values}
                      spinner={spinner}
                      fetchCurp={fetchCurp}
                    />
                  </TabPane>
                  <TabPane tab="Direccion" key={2}>
                    <AddressForm
                      selectedFigure={selectedFigure}
                      location={location}
                      resetValues={resetAddressValues}
                      setErrorList={setErrorList}
                      setLocation={setLocation}
                      values={values}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      countryOption={countryOption}
                      stateOption={stateOption}
                      cityOption={cityOption}
                      colonyOption={colonyOption}
                      postalCodeOption={postalCodeOption}
                      errorList={errorList}
                      getSelectOptions={getSelectOptions}
                    />
                  </TabPane>
                </Tabs>
              )}
              {errorAlert ? (
                <Row>
                  <Col md={24}>
                    <div className={"alert alert-danger m-0 mt-3"}>
                      {errorAlert}
                    </div>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
              <Row className={errorAlert ? "mt-3" : "mt-4"}>
                <Col md={12}>
                  <FormGroup>
                    {!location.isValidated && location.isManual ? (
                      <FormGroup>
                        {btnSpinner ? (
                          <Button
                            className="entityBtnDuplicate"
                            disabled={true}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            ></Spinner>
                          </Button>
                        ) : (
                          <input
                            key="back"
                            className={`entityBtn`}
                            type="submit"
                            value={"Verifica la dirección"}
                          />
                        )}
                      </FormGroup>
                    ) : (
                      <>
                        {btnSpinner ? (
                          <Button
                            className="entityBtnDuplicate"
                            disabled={true}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            ></Spinner>
                          </Button>
                        ) : (
                          <input
                            key="back"
                            className="entityBtn"
                            type="submit"
                            value={`${
                              selectedFigure ? "Actualizada" : "Crear"
                            } ${btnValues[location.type] || "Figura"}`}
                            disabled={!isManual && !isValid}
                          />
                        )}
                      </>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </>
          </Form>
        )}
      />
    </Modal>
  );
}

export default EntityModal;
