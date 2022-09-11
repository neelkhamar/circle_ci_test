import { LoadingOutlined } from "@ant-design/icons";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button, Modal, Spin, Switch } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import {
  getCityList,
  getColonyList,
  getCountryList,
  getLatLong,
  getLocationById,
  getPostalCodeList,
  getStateList,
  saveAddress,
  updateLocation,
} from "../../../requests/carta-porte";
import alertContainer from "../../../utils/Alert";
import { CountryData } from "../Data/countries";
import SearchForm from "../searchForm";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_Google_API_Key,
  libraries: ["places"],
};

function LocationModal(props) {
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const { visible, handleCancel, handleOk, selected } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [btnValue, setBtnValue] = useState("Crear Ubicaciones");
  const [isManual, setIsManual] = useState(false);
  const [location, setLocation] = useState({
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
  const [countryOption, setCountryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);
  const [postalCodeOption, setPostalCodeOption] = useState([]);
  const [colonyOption, setColonyOption] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (selected) {
        getSelectedData();
        setBtnValue("Actualizar Ubicaciones");
      } else {
        getCountries();
      }
    }

    return () => (mounted = false);
  }, []);

  const getSelectedData = () => {
    setSpinner(true);
    getLocationById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      selected
    ).then(
      async (response) => {
        setSpinner(false);
        console.log(response);
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
          setIsManual(!resp.address);
          setLocation({
            ...location,
            lat: parseFloat(resp.latitude),
            lng: parseFloat(resp.longitude),
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
          });
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const getCountries = () => {
    setSpinner(true);
    getCountryList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data.data) {
          setCountryOption(response.data.data);
        }
      },
      (error) => {
        setSpinner(false);
        console.log(error);
      }
    );
  };

  const inputHandler = (key, value, values) => {
    setLocation({
      ...location,
      ...values,
      [key]: value,
    });
  };

  const resetValues = () => {
    setLocation({
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

  const containerStyle = {
    width: "100%",
    height: "300px",
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

  const saveData = (values) => {
    setBtnSpinner(true);
    setErrorList([]);
    let payload = {
      longitude: location.lng,
      latitude: location.lat,
      address: location.address,
      street: isManual ? values.street : values.street1,
      inside_number: isManual ? values.insideNumber : values.insideNumber1,
      outside_number: isManual ? values.outsideNumber : values.outsideNumber1,
      catalog_colony_id: isManual ? values.colony.split("/")[0] : values.colony,
    };
    saveAddress(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      payload
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 201) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          handleOk();
        }
      },
      (err) => {
        setErrorList(err.response.data.errors);
        setBtnSpinner(false);
      }
    );
  };

  const getEmoji = (code) => {
    if (code) {
      return CountryData[code] ? CountryData[code].emoji : "";
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

  const updateLocationDetails = (values) => {
    setBtnSpinner(true);
    let payload = {
      longitude: location.lng,
      latitude: location.lat,
      address: location.address,
      street: isManual ? values.street : values.street1,
      inside_number: isManual ? values.insideNumber : values.insideNumber1,
      outside_number: isManual ? values.outsideNumber : values.outsideNumber1,
      catalog_colony_id: isManual ? values.colony.split("/")[0] : values.colony,
    };
    updateLocation(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      payload,
      selected
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 201) {
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
  };

  return (
    <Modal
      className="entityModalContainer"
      title="Nueva Ubicacion"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      {spinner ? (
        <div className="text-center pt-4">
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <Formik
          initialValues={location}
          enableReinitialize={true}
          validationSchema={() =>
            Yup.lazy((values) => {
              let validate = {};
              if (isManual) {
                validate["country"] = Yup.string().required(
                  "Se requiere la Pais"
                );
                validate["state"] = Yup.string().required(
                  "Se requiere la Expresar"
                );
                validate["city"] = Yup.string().required(
                  "Se requiere la Ciudad"
                );
                validate["postalCode"] = Yup.string().required(
                  "Se requiere la Código postal"
                );
                validate["colony"] = Yup.string().required(
                  "Se requiere la Colonia"
                );
                validate["street"] = Yup.string()
                  .required("Se requiere la Calle")
                  .min(3, "La Calle debe tener más de 3 caracteres")
                  .max(150, "La Calle debe tener menos de 150 caracteres");
                validate["outsideNumber"] = Yup.string()
                  .required("Se requiere la Número externo")
                  .max(
                    100,
                    "La Número externo debe tener menos de 100 caracteres"
                  );
                validate["insideNumber"] = Yup.string().max(
                  100,
                  "La Número interior debe tener menos de 100 caracteres"
                );
                return Yup.object().shape(validate);
              } else {
                validate["street1"] = Yup.string()
                  .required("Se requiere la Calle")
                  .min(3, "La Calle debe tener más de 3 caracteres")
                  .max(150, "La Calle debe tener menos de 150 caracteres");
                validate["outsideNumber1"] = Yup.string()
                  .required("Se requiere la Número externo")
                  .max(
                    100,
                    "La Número externo debe tener menos de 100 caracteres"
                  );
                validate["insideNumber1"] = Yup.string().max(
                  100,
                  "La Número interior debe tener menos de 100 caracteres"
                );
                return Yup.object().shape(validate);
              }
            })
          }
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus();
            if (isManual) {
              setErrorList([]);
              if (location.isValidated) {
                if (selected) {
                  updateLocationDetails(values);
                } else {
                  saveData(values);
                }
              } else {
                handleVerify(values);
              }
            } else {
              if (location.address && location.colony) {
                setErrorList([]);
                if (selected) {
                  updateLocationDetails(values);
                } else {
                  saveData(values);
                }
              } else {
                return null;
              }
            }
          }}
          render={({ handleBlur, values, handleChange }) => (
            <Form>
              <>
                <Row className="ant-row">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2 mb-3 d-flex">
                    <Switch
                      checked={isManual}
                      className="mr-3"
                      onChange={(val) => {
                        resetValues();
                        setErrorList([]);
                        setIsManual(val);
                        if (
                          !countryOption ||
                          (countryOption.length === 0 && val)
                        ) {
                          getCountries();
                        }
                      }}
                    />
                    <h5>Ingresar manualmente</h5>
                  </div>
                  {!isManual ? (
                    <>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Address <span className="red-color">*</span>
                            </Label>
                            <SearchForm
                              location={location}
                              errorList={[]}
                              isLoaded={isLoaded}
                              loadError={loadError}
                              setLocation={setLocation}
                              containerStyle={containerStyle}
                              resetValues={resetValues}
                            />
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Calle<span className="red-color">*</span>
                            </Label>
                            <FormItem name="street1">
                              <Field
                                name="street1"
                                type="text"
                                className={"form-control"}
                                placeholder="Calle"
                                disabled={true}
                                value={values.street1}
                                onChange={handleChange}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                        <FormGroup>
                          <Label className="form-label">Número interior</Label>
                          <FormItem name="insideNumber1">
                            <Field
                              name="insideNumber1"
                              type="text"
                              className={"form-control"}
                              placeholder="Número interior"
                              value={values.insideNumber1}
                              onChange={(e) => handleChange(e)}
                              // onChange={(e) => inputHandler("insideNumber1", e.target.value, values)}
                            />
                          </FormItem>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Número externo<span className="red-color">*</span>
                            </Label>
                            <FormItem name="outsideNumber1">
                              <Field
                                name="outsideNumber1"
                                type="text"
                                disabled={location.disableOutsideNumber}
                                className={"form-control"}
                                placeholder="Número externo"
                                value={values.outsideNumber1}
                                onChange={(e) => handleChange(e)}
                                // onChange={(e) => inputHandler("outsideNumber1", e.target.value, values)}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Pais<span className="red-color">*</span>
                            </Label>
                            <FormItem name="country">
                              <Select
                                showSearch
                                name="country"
                                onBlur={handleBlur}
                                placeholder="Pais"
                                className={"form-control p-0"}
                                value={values.country}
                                onChange={(e) => {
                                  setLocation({
                                    ...values,
                                    country: e,
                                    state: "",
                                    city: "",
                                    postalCode: "",
                                    colony: "",
                                    isValidated: false,
                                    lat: "",
                                    lng: "",
                                  });
                                  getSelectOptions("state", e);
                                }}
                                filterOption={(input, option) => {
                                  let str = "";
                                  option.children.map((item) => {
                                    str = str + item;
                                  });
                                  return (
                                    str
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                              >
                                {countryOption.map((item, index) => {
                                  return (
                                    <Select.Option value={item.id} key={index}>
                                      {getEmoji(item.code2)} ({item.code}) -{" "}
                                      {item.name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Estado<span className="red-color">*</span>
                            </Label>
                            <FormItem name="state">
                              <Select
                                showSearch
                                name="state"
                                onBlur={handleBlur}
                                placeholder="Estado"
                                disabled={!values.country}
                                className={"form-control p-0"}
                                value={values.state}
                                onChange={(e) => {
                                  setLocation({
                                    ...values,
                                    state: e,
                                    city: "",
                                    postalCode: "",
                                    colony: "",
                                    isValidated: false,
                                    lat: "",
                                    lng: "",
                                  });
                                  getSelectOptions("city", e);
                                }}
                                filterOption={(input, option) => {
                                  let str = "";
                                  option.children.map((item) => {
                                    str = str + item;
                                  });
                                  return (
                                    str
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                              >
                                {stateOption.map((item, index) => {
                                  return (
                                    <Select.Option value={item.id} key={index}>
                                      ({item.code}) - {item.name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Ciudad<span className="red-color">*</span>
                            </Label>
                            <FormItem name="city">
                              <Select
                                showSearch
                                name="city"
                                onBlur={handleBlur}
                                placeholder="Ciudad"
                                disabled={!values.state}
                                className={"form-control p-0"}
                                value={values.city}
                                onChange={(e) => {
                                  setLocation({
                                    ...values,
                                    city: e,
                                    postalCode: "",
                                    colony: "",
                                    isValidated: false,
                                    lat: "",
                                    lng: "",
                                  });
                                  getSelectOptions("postalCode", e);
                                }}
                                filterOption={(input, option) => {
                                  let str = "";
                                  option.children.map((item) => {
                                    str = str + item;
                                  });
                                  return (
                                    str
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                              >
                                {cityOption.map((item, index) => {
                                  return (
                                    <Select.Option value={item.id} key={index}>
                                      ({item.code}) - {item.name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Código postal<span className="red-color">*</span>
                            </Label>
                            <FormItem name="postalCode">
                              <Select
                                showSearch
                                name="postalCode"
                                onBlur={handleBlur}
                                placeholder="Código postal"
                                disabled={!values.city}
                                className={"form-control p-0"}
                                value={values.postalCode}
                                onChange={(e) => {
                                  setLocation({
                                    ...values,
                                    postalCode: e,
                                    colony: "",
                                    isValidated: false,
                                    lat: "",
                                    lng: "",
                                  });
                                  getSelectOptions("colony", e);
                                }}
                                filterOption={(input, option) => {
                                  return (
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                              >
                                {postalCodeOption.map((item, index) => {
                                  return (
                                    <Select.Option value={item.id} key={index}>
                                      {item.name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2 width50">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Colonia<span className="red-color">*</span>
                            </Label>
                            <FormItem name="colony">
                              <Select
                                showSearch
                                name="colony"
                                onBlur={handleBlur}
                                placeholder="Colonia"
                                disabled={!values.postalCode}
                                className={"form-control p-0"}
                                value={values.colony}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                filterOption={(input, option) => {
                                  return (
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                              >
                                {colonyOption.map((item, index) => {
                                  return (
                                    <Select.Option
                                      value={`${item.id}/${item.name}`}
                                      key={index}
                                    >
                                      {item.name}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Calle<span className="red-color">*</span>
                            </Label>
                            <FormItem name="street">
                              <Field
                                name="street"
                                type="text"
                                className={"form-control"}
                                placeholder="Calle"
                                value={values.street}
                                onChange={(e) => handleChange(e)}
                                // onChange={(e) => inputHandler("street", e.target.value, values)}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Número interior
                            </Label>
                            <FormItem name="insideNumber">
                              <Field
                                name="insideNumber"
                                type="text"
                                className={"form-control"}
                                placeholder="Número interior"
                                value={values.insideNumber}
                                onChange={(e) => handleChange(e)}
                                // onChange={(e) => inputHandler("insideNumber", e.target.value, values)}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Número externo<span className="red-color">*</span>
                            </Label>
                            <FormItem name="outsideNumber">
                              <Field
                                name="outsideNumber"
                                type="text"
                                className={"form-control"}
                                placeholder="Número externo"
                                value={values.outsideNumber}
                                onChange={(e) => handleChange(e)}
                                // onChange={(e) => inputHandler("outsideNumber", e.target.value, values)}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                    </>
                  )}
                </Row>
                {location.lat && location.lng ? (
                  <Row>
                    {isManual ? (
                      <Col md={24}>
                        <small>
                          <b>NOTE:</b> Move the marker to set the location.
                        </small>
                      </Col>
                    ) : null}
                    <Col md={24}>
                      <div className="mt-4">
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          center={{
                            lat: location.lat,
                            lng: location.lng,
                          }}
                          zoom={15}
                        >
                          <Marker
                            draggable={isManual}
                            onDragEnd={(e) => {
                              if (e) {
                                setLocation({
                                  ...values,
                                  lat: e.latLng.lat(),
                                  lng: e.latLng.lng(),
                                });
                              }
                            }}
                            position={{
                              lat: location.lat,
                              lng: location.lng,
                            }}
                          />
                        </GoogleMap>
                      </div>
                    </Col>
                  </Row>
                ) : null}
                {errorList.length > 0 &&
                  errorList.map((err, index) => {
                    return (
                      <Row key={index}>
                        <Col md={24}>
                          <div className={"alert alert-danger m-0 mt-2"}>
                            {err}
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                <Row className={`${errorList.length > 0 ? "mt-3" : "mt-4"}`}>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                    <FormGroup>
                      {!location.isValidated && isManual ? (
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
                              value={btnValue}
                            />
                          )}
                        </FormGroup>
                      )}
                    </FormGroup>
                  </div>
                </Row>
              </>
            </Form>
          )}
        />
      )}
    </Modal>
  );
}

export default LocationModal;
