import { LoadingOutlined } from "@ant-design/icons";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button, Modal, Spin, Switch, Tabs } from "antd";
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
  getPostalCodeList,
  getStateList,
  validateRFCValue,
} from "../../../requests/carta-porte";
import {
  createCustomers,
  getCustomerById,
  getProductOptions,
  getProductTipoOptions,
  getTaxRegime,
  searchProductCategory,
  updateCustomers,
} from "../../../requests/cliente";
import alertContainer from "../../../utils/Alert";
import { fetchHelperProduct, fetchHelperRegime } from "../../Helper/client";
import { CountryData } from "../Data/countries";
import ProductCategory from "../productCategory";
import SearchForm from "../searchForm";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_Google_API_Key,
  libraries: ["places"],
};

function ClientModal(props) {
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const { TabPane } = Tabs;
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const { visible, handleCancel, handleOk, selectedCustomer } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [searchSpinner, setSearchSpinner] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [btnValue, setBtnValue] = useState("Crear cliente");
  const [formTitle, setFormTitle] = useState("Nuevo Cliente");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [productOptions, setProductOptions] = useState({
    type: [],
    division: [],
    group: [],
    class: [],
  });
  const [regimeOption, setRegimeOption] = useState([]);
  const [selectedRegimeOption, setSelectedRegimeOption] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [requiredRegime, setRequiredRegime] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [location, setLocation] = useState({
    name: "",
    rfc: "",
    lat: "",
    lng: "",
    selected: false,
    isManual: false,
    isValidated: false,
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
    type: "",
    division: "",
    group: "",
    class: "",
    search: "",
    phone: "",
    email: "",
    phone1: "",
    email1: "",
  });
  const [errorList, setErrorList] = useState([]);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(async () => {
    let mounted = true;
    if (mounted) {
      if (selectedCustomer) {
        setBtnValue("Actualizar cliente");
        await Promise.all([
          getOneCustomer(selectedCustomer),
          getRegimeOptions(),
        ]);
      } else {
        await Promise.all([getCountries(), getRegimeOptions()]);
      }
      getTipoOptions();
    }

    return () => (mounted = false);
  }, []);

  const getRegimeOptions = () => {
    setSpinner(true);
    getTaxRegime(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          setRegimeOption(response.data.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const resetValues = (isManual = location.isManual) => {
    setLocation({
      ...location,
      lat: "",
      lng: "",
      selected: false,
      isValidated: false,
      address: "",
      country: "",
      state: "",
      city: "",
      colony: "",
      postalCode: "",
      street: "",
      insideNumber: "",
      outsideNumber: "",
      regime: [],
      phone: "",
      email: "",
      street1: "",
      insideNumber1: "",
      outsideNumber1: "",
      disableOutsideNumber: false,
      regime1: [],
      phone1: "",
      email1: "",
      isManual: isManual,
    });
    setErrorList([]);
  };

  const containerStyle = {
    width: "100%",
    height: "300px",
  };

  const inputHandler = (key, value) => {
    setLocation({
      ...location,
      [key]: value,
    });
  };

  const [options, setOptions] = useState({
    country: [],
    state: [],
    city: [],
    postalCode: [],
    colony: [],
  });

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
          setOptions({
            ...options,
            country: response.data.data,
          });
        }
      },
      (error) => {
        setSpinner(false);
        console.log(error);
      }
    );
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
            setOptions({
              ...options,
              state: resp.data.data,
            });
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
            setOptions({
              ...options,
              city: resp.data.data,
            });
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
            setOptions({
              ...options,
              postalCode: resp.data.data,
            });
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
            setOptions({
              ...options,
              colony: resp.data.data,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const getTipoOptions = () => {
    setSpinner(true);
    getProductTipoOptions(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (resp) => {
        setSpinner(false);
        if (resp.status === 200) {
          setProductOptions({
            ...productOptions,
            type: resp.data.data,
          });
        }
      },
      (error) => {
        setSpinner(false);
        console.log(error);
      }
    );
  };

  const productCategoryOptions = (key, val) => {
    getProductOptions(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      val
    ).then(
      (resp) => {
        if (resp.status === 200) {
          setProductOptions({
            ...productOptions,
            [key]: resp.data.data,
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const getAllOptions = async (response) => {
    setSpinner(true);
    let opt = {};
    let countryList = await getCountryList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    );
    if (countryList.status === 200) {
      opt["country"] = countryList.data.data;
    }
    let stateList = await getStateList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      response.catalog_colony.catalog_postal_code.catalog_municipality
        .catalog_state.catalog_country.id
    );
    if (stateList.status === 200) {
      opt["state"] = stateList.data.data;
    }
    let cityList = await getCityList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      response.catalog_colony.catalog_postal_code.catalog_municipality
        .catalog_state.id
    );
    if (cityList.status === 200) {
      opt["city"] = cityList.data.data;
    }
    let postalList = await getPostalCodeList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      response.catalog_colony.catalog_postal_code.catalog_municipality.id
    );
    if (postalList.status === 200) {
      opt["postalCode"] = postalList.data.data;
    }
    let colonyList = await getColonyList(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      response.catalog_colony.catalog_postal_code.id
    );
    if (colonyList.status === 200) {
      opt["colony"] = colonyList.data.data;
    }
    setOptions(opt);
    setSpinner(false);
  };

  const getOneCustomer = (id) => {
    setSpinner(true);
    getCustomerById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          let data = response.data;
          if (!data.address) {
            getAllOptions(data);
          }
          let regimeSelected = [];
          data.tax_regimes.map((item) => {
            regimeSelected.push(item.catalog_tax_regime.id);
          });
          setRequiredRegime(regimeSelected);
          setSelectedRegimeOption(data.tax_regimes);
          setLocation({
            ...location,
            isManual: !data.address,
            name: data.name,
            rfc: data.rfc,
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
            street: data.street,
            street1: data.street,
            address: data.address,
            insideNumber: data.inside_number,
            insideNumber1: data.inside_number,
            outsideNumber: data.outside_number,
            outsideNumber1: data.outside_number,
            country:
              data.catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.catalog_country.id,
            state:
              data.catalog_colony.catalog_postal_code.catalog_municipality
                .catalog_state.id,
            city: data.catalog_colony.catalog_postal_code.catalog_municipality
              .id,
            colony: !data.address
              ? data.catalog_colony.id + "/" + data.catalog_colony.name
              : data.catalog_colony.id,
            postalCode: data.catalog_colony.catalog_postal_code.id,
            isValidated: true,
            disableOutsideNumber: true,
            selected: true,
            type: "",
            division: "",
            group: "",
            class: "",
            regime: regimeSelected,
            phone: data.telephone || "",
            email: data.email || "",
          });
          let checked = [];
          data.product_categories.map((item) => {
            item.groups.map((group) => {
              group.classes.map((clase) => {
                checked.push(clase.id + "|class|" + group.code);
              });
            });
          });
          setCheckedKeys(checked);
          setOriginalList(data.product_categories);
          setProductCategoryList(data.product_categories);
          setFormTitle("Actualizar Cliente");
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const getEmoji = (code) => {
    if (code) {
      return CountryData[code] ? CountryData[code].emoji : "";
    }
  };

  const handleVerify = (values) => {
    let name = "";
    Object.values(options.country).map((item) => {
      if (item.id === values.country) {
        name = item.name;
      }
    });
    let address = `${values.colony.split("/")[1]}, ${values.postalCode}, ${
      values.state
    }, ${name}`;
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

  const searchCategoryList = () => {
    setSearchSpinner(true);
    setTreeData([]);
    let query = "";
    if (location.search && (location.class || location.group)) {
      let subQuery = location.class
        ? `class_id=${location.class}`
        : `group_id=${location.group}`;
      query = `q=${location.search}&${subQuery}`;
    } else if (location.search && !location.class && !location.group) {
      query = `q=${location.search}`;
    } else if (location.class || location.group) {
      query = location.class
        ? `class_id=${location.class}`
        : `group_id=${location.group}`;
    }
    searchProductCategory(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      query
    ).then(
      (response) => {
        setSearchSpinner(false);
        if (response.status === 200) {
          setProductCategoryList(response.data.data);
        } else {
          setErrorList(["Something went wrong, try again later"]);
        }
      },
      (error) => {
        setSearchSpinner(false);
      }
    );
  };

  const saveData = async (values) => {
    let regimes = await fetchHelperRegime(
      values.regime,
      requiredRegime,
      selectedRegimeOption
    );
    let payload = {
      name: values.name,
      rfc: values.rfc,
      address: location.address,
      latitude: location.lat,
      longitude: location.lng,
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
      customer_product_categories_attributes: [],
      email: values.email,
      telephone: values.phone,
      tax_regimes_attributes: regimes,
    };
    let finalClasses = await fetchHelperProduct(selectedProduct, originalList);
    payload["customer_product_categories_attributes"] = finalClasses;

    setBtnSpinner(true);
    if (selectedCustomer) {
      updateCustomers(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        selectedCustomer,
        payload
      ).then(
        (response) => {
          setBtnSpinner(false);
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
          setErrorList(error.response.data.errors);
          setBtnSpinner(false);
        }
      );
    } else {
      createCustomers(
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
          setErrorList(error.response.data.errors);
          setBtnSpinner(false);
        }
      );
    }
  };

  const validateRFC = (val) => {
    let error;
    if (val && !/^[A-Z]{3,4}[0-9]{6}[0-9A-Z]{3}$/i.test(val)) {
      error = "Introduzca un RFC válido";
    }
    return error;
  };

  const validatePhone = (val) => {
    let error;
    if (val && !/^[0-9]{3}[0-9]{3}[0-9]{4}$/i.test(val)) {
      error = "Introduzca un Phone válido";
    }
    return error;
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
      title={formTitle}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      {spinner ? (
        <div className="text-center">
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <Formik
          initialValues={location}
          enableReinitialize={true}
          validationSchema={() =>
            Yup.lazy((values) => {
              let validate = {
                name: Yup.string()
                  .required("Se requiere la Razon Social")
                  .min(3, "La Razon Social debe tener más de 3 caracteres")
                  .max(
                    100,
                    "La Razon Social debe tener menos de 100 caracteres"
                  ),
                rfc: Yup.string().required("Se requiere la RFC"),
              };
              if (location.isManual) {
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
              }
              return Yup.object().shape(validate);
            })
          }
          onSubmit={async (values, { setStatus, setSubmitting }) => {
            setStatus();
            setErrorList([]);
            if (location.isManual) {
              if (location.isValidated) {
                let isValid = await checkRFC(values.rfc);
                if (isValid) {
                  saveData(values);
                } else {
                  let errors = ["Invalid RFC. Please enter a valid RFC"];
                  setErrorList(errors);
                }
              } else {
                handleVerify(values);
              }
            } else {
              if (location.address && location.colony) {
                let isValid = await checkRFC(values.rfc);
                if (isValid) {
                  saveData(values);
                } else {
                  let errors = ["Invalid RFC. Please enter a valid RFC"];
                  setErrorList(errors);
                }
              } else {
                return null;
              }
            }
          }}
          render={({
            errors,
            status,
            touched,
            handleChange,
            values,
            handleBlur,
          }) => (
            <Form>
              <>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Informacion" className="p-3 border1" key="1">
                    <>
                      <Row className="ant-row">
                        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2 mb-3 d-flex">
                          <Switch
                            checked={location.isManual}
                            className="mr-3"
                            onChange={(val) => {
                              resetValues(val);
                              setErrorList([]);
                              if (
                                !options.country ||
                                (options.country.length === 0 && val)
                              ) {
                                getCountries();
                              }
                            }}
                          />
                          <h5>Ingresar manualmente</h5>
                        </div>
                        {!location.isManual ? (
                          <>
                            <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                              <FormGroup>
                                <div>
                                  <Label className="form-label">
                                    Domicilio{" "}
                                    <span className="red-color">*</span>
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
                                      disabled={true}
                                      className={"form-control"}
                                      placeholder="Calle"
                                      value={values.street1}
                                      onChange={handleChange}
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
                                  <FormItem name="insideNumber1">
                                    <Field
                                      name="insideNumber1"
                                      type="text"
                                      className={"form-control"}
                                      placeholder="Número interior"
                                      value={values.insideNumber1}
                                      onChange={handleChange}
                                    />
                                  </FormItem>
                                </div>
                              </FormGroup>
                            </div>
                            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                              <FormGroup>
                                <div>
                                  <Label className="form-label">
                                    Número externo
                                    <span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="outsideNumber1">
                                    <Field
                                      name="outsideNumber1"
                                      type="text"
                                      disabled={location.disableOutsideNumber}
                                      className={"form-control"}
                                      placeholder="Número externo"
                                      value={values.outsideNumber1}
                                      onChange={handleChange}
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
                                      {options.country.map((item, index) => {
                                        return (
                                          <Select.Option
                                            value={item.id}
                                            key={index}
                                          >
                                            {getEmoji(item.code2)} ({item.code})
                                            - {item.name}
                                          </Select.Option>
                                        );
                                      })}
                                    </Select>
                                    {/* {CountryData[item.id].emoji} */}
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
                                      {options.state.map((item, index) => {
                                        return (
                                          <Select.Option
                                            value={item.id}
                                            key={index}
                                          >
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
                                      {options.city.map((item, index) => {
                                        return (
                                          <Select.Option
                                            value={item.id}
                                            key={index}
                                          >
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
                                    Código postal
                                    <span className="red-color">*</span>
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
                                      {options.postalCode.map((item, index) => {
                                        return (
                                          <Select.Option
                                            value={item.id}
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
                            <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
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
                                      {options.colony.map((item, index) => {
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
                                      onChange={handleChange}
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
                                      onChange={handleChange}
                                    />
                                  </FormItem>
                                </div>
                              </FormGroup>
                            </div>
                            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                              <FormGroup>
                                <div>
                                  <Label className="form-label">
                                    Número externo
                                    <span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="outsideNumber">
                                    <Field
                                      name="outsideNumber"
                                      type="text"
                                      className={"form-control"}
                                      placeholder="Número externo"
                                      value={values.outsideNumber}
                                      onChange={handleChange}
                                    />
                                  </FormItem>
                                </div>
                              </FormGroup>
                            </div>
                          </>
                        )}
                        <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33 height38">
                          <FormGroup>
                            <div>
                              <Label className="form-label">
                                Tax Regime<span className="red-color">*</span>
                              </Label>
                              <FormItem name="regime">
                                <Select
                                  showSearch
                                  name="regime"
                                  onBlur={handleBlur}
                                  placeholder="Tax Regime"
                                  className={"form-control p-0"}
                                  value={values.regime}
                                  mode="multiple"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  filterOption={(input, option) => {
                                    if (typeof option.children == "object") {
                                      let str = "";
                                      Object.keys(option.children).map(
                                        (item) => {
                                          str = str + option.children[item];
                                        }
                                      );
                                      return (
                                        str
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      );
                                    } else {
                                      return (
                                        option.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      );
                                    }
                                  }}
                                >
                                  {regimeOption.map((item, index) => {
                                    return (
                                      <Select.Option
                                        value={item.id}
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
                                Email Address
                              </Label>
                              <FormItem name="email">
                                <Field
                                  name="email"
                                  type="text"
                                  className={"form-control"}
                                  validate={validateEmail}
                                  placeholder="Email Address"
                                  value={values.email}
                                  onChange={handleChange}
                                />
                              </FormItem>
                            </div>
                          </FormGroup>
                        </div>
                        <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                          <FormGroup>
                            <div>
                              <Label className="form-label">Phone Number</Label>
                              <FormItem name="phone">
                                <Field
                                  name="phone"
                                  type="phone"
                                  validate={validatePhone}
                                  className={"form-control"}
                                  placeholder="Phone Number"
                                  value={values.phone}
                                  onChange={handleChange}
                                />
                              </FormItem>
                            </div>
                          </FormGroup>
                        </div>
                        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                          <FormGroup>
                            <div>
                              <Label className="form-label">
                                Razon Social{" "}
                                <span className="red-color">*</span>
                              </Label>
                              <FormItem name="name">
                                <Field
                                  name="name"
                                  type="text"
                                  className={"form-control"}
                                  placeholder="Ingrese Razon Social"
                                  value={values.name}
                                  onChange={handleChange}
                                />
                              </FormItem>
                            </div>
                          </FormGroup>
                        </div>
                        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                          <FormGroup>
                            <div>
                              <Label className="form-label">
                                RFC <span className="red-color">*</span>
                              </Label>
                              <FormItem name="rfc">
                                <Field
                                  name="rfc"
                                  type="text"
                                  validate={validateRFC}
                                  className={"form-control"}
                                  placeholder="Ingrese RFC"
                                  value={values.rfc}
                                  onChange={handleChange}
                                />
                              </FormItem>
                            </div>
                          </FormGroup>
                        </div>
                      </Row>
                      {isLoaded && location.lat && location.lng ? (
                        <Row>
                          {location.isManual ? (
                            <Col md={24}>
                              <small>
                                <b>NOTE:</b> Move the marker to set the
                                location.
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
                                  draggable={location.isManual}
                                  onDragEnd={(e) => {
                                    setLocation({
                                      ...values,
                                      lat: e.latLng.lat(),
                                      lng: e.latLng.lng(),
                                    });
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
                    </>
                  </TabPane>
                  <TabPane
                    tab="Categorias de productos"
                    className="p-3 border1"
                    key="2"
                  >
                    <ProductCategory
                      productOptions={productOptions}
                      values={values}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      productCategoryOptions={productCategoryOptions}
                      setLocation={setLocation}
                      location={location}
                      searchCategoryList={searchCategoryList}
                      searchSpinner={searchSpinner}
                      expandedKeys={expandedKeys}
                      setExpandedKeys={setExpandedKeys}
                      checkedKeys={checkedKeys}
                      setCheckedKeys={setCheckedKeys}
                      treeData={treeData}
                      setTreeData={setTreeData}
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                      productCategoryList={productCategoryList}
                    />
                  </TabPane>
                </Tabs>
                {errorList.length > 0 &&
                  errorList.map((err, index) => {
                    return (
                      <Row key={index}>
                        <Col md={24}>
                          <div className={"alert alert-danger m-0 mt-3"}>
                            {err}
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                <Row className={errorList.length > 0 ? "mt-3" : "mt-4"}>
                  <Col md={12}>
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
                  </Col>
                </Row>
              </>
            </Form>
          )}
        />
      )}
    </Modal>
  );
}

export default ClientModal;
