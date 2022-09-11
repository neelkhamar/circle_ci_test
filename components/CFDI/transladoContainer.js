import { Button, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { Cards } from "../cards/frame/cards-frame";
import { PageHeader } from "../page-headers/page-headers";
import { LoadingOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import { createIngresoTranslado, getCFDIOptions } from "../../requests/cfdi";
import { getFleteById } from "../../requests/flete";
import alertContainer from "../../utils/Alert";
import FleteConcepts from "../Flete/fleteConcepts";
import { Main } from "./styled";
import ToastMessage from "../../utils/toastContainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const TransladoContainer = () => {
  const router = useRouter();

  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [conceptTableData, setConceptTableData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [taxRateOptions, setTaxRateOptions] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [useOption, setUseOption] = useState([]);
  const [measurementOption, setMeasurementOption] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [isPrefill, setIsPrefill] = useState(false);
  const [defaultMeasurement, setDefaultMeasurement] = useState(null);
  const [selectedCFDI, setSelectedCFDI] = useState("");
  const [tax_system, set_tax_system] = useState("");
  const [alreadyCreated, setAlreadyCreated] = useState(false);
  const [data, setData] = useState({
    type: "Translado",
    currency: undefined,
    use: undefined,
    date: moment(),
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const conceptTableColumns = [
    {
      label: "Producto",
      key: "product",
    },
    {
      label: "Measurement unit",
      key: "measurementUnit",
    },
    {
      label: "Descripción",
      key: "description",
    },
    {
      label: "Cantidad",
      key: "quantity",
    },
    {
      label: "Precio unitario",
      key: "unit_price",
    },
    {
      label: "Tasas de impuestos (%)",
      key: "tax_rate",
    },
    {
      label: "Impuestos",
      key: "tax",
    },
    {
      label: "Porcentaje descuento",
      key: "discount",
    },
    {
      label: "Subtotal",
      key: "subtotal",
    },
  ];

  const redirectBack = () => {
    if (router.query && router.query.backUrl) {
      router.push(`/${router.query.backUrl}/`);
    } else {
      router.push("/cfdi/");
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (!router.route.includes("create")) {
        fetchOptions(0);
      }
    }

    return () => (mounted = false);
  }, []);

  const getFleteDetails = (id, customers) => {
    setSpinner(true);
    getFleteById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        setIsPrefill(true);
        if (response.data.data.attributes.cfdi.data) {
          setAlreadyCreated(true);
          ToastMessage(
            "CFDI Translado is already created for this Flete",
            false
          );
        }
        let { customer, catalog_currency, cfdi_concepts } =
          response.data.data.attributes;
        setData({
          ...data,
          type: "Translado",
          currency: catalog_currency.id,
          client: customer.id,
        });

        assignTaxSystem(customer, customers);
        setConceptosData(cfdi_concepts.data);
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const assignTaxSystem = (customer, customers) => {
    customers.map((item) => {
      if (customer.id === item.id) {
        set_tax_system(
          item.attributes.tax_regimes.data[
            item.attributes.tax_regimes.data.length - 1
          ].attributes.catalog_tax_regime
        );
      }
    });
  };

  const setConceptosData = (list) => {
    let tableData = [];
    let pOptions = [];
    let usedProducts = [];
    let mOptions = [];
    let usedMeasurement = [];
    list.map((item) => {
      let pId = item.attributes.product_service.data.id;
      let measureObj =
        item.attributes.product_service.data.attributes
          .catalog_measurement_unit;
      let obj = {
        product: pId,
        description: item.attributes.description,
        quantity: item.attributes.quantity,
        unit_price: item.attributes.price,
        tax_rate: [],
        tax: item.attributes.tax,
        discount: item.attributes.discount_percentage,
        subtotal: item.attributes.subtotal,
        productObj:
          item.attributes.product_service.data.attributes
            .catalog_product_service,
        measurementUnit:
          measureObj.id + "/" + measureObj.code + "/" + measureObj.name,
      };
      item.attributes.tax_rates.data.map((val) => {
        obj["tax_rate"].push(val.attributes.catalog_tax_rate.id);
      });
      if (!usedProducts.includes(pId)) {
        pOptions.push(
          item.attributes.product_service.data.attributes
            .catalog_product_service
        );
        usedProducts.push(pId);
      }
      if (!usedMeasurement.includes(measureObj.id)) {
        mOptions.push(measureObj);
        usedMeasurement.push(measureObj.id);
      }
      tableData.push(obj);
    });
    setMeasurementOption(mOptions);
    // setProductOptions(pOptions);
    setConceptTableData(tableData);
  };

  useEffect(() => {
    if (router.query.id) {
      fetchOptions(router.query.id);
      setSelectedCFDI(router.query.id);
    }
  }, [router.query]);

  const fetchOptions = (editValue) => {
    setSpinner(true);
    getCFDIOptions(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          setCustomers(response.data.customers.data);
          setTaxRateOptions(response.data.catalog_tax_rates);
          setCurrencyOption(response.data.catalog_currencies);
          setUseOption(response.data.catalog_cfdi_uses);
          setDefaultMeasurement(response.data.measurement_unit_default);
          setMeasurementOption([response.data.measurement_unit_default]);
          setProductOptions(response.data.product_services.data);
          if (editValue) {
            getFleteDetails(editValue, response.data.customers.data);
          }
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const disabledDate = (date) => {
    if (moment(date) >= moment().subtract(4, "d") && moment(date) <= moment()) {
      return false;
    } else {
      return true;
    }
  };

  const submitCFDI = (payload) => {
    if (isPrefill) {
      payload["freight_id"] = selectedCFDI;
    }
    setErrorList([]);
    createIngresoTranslado(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      payload
    ).then(
      (response) => {
        setBtnSpinner(false);
        alertContainer({
          title: response.data.message,
          text: "",
          icon: "success",
          showConfirmButton: false,
        });
        redirectBack();
      },
      (error) => {
        setBtnSpinner(false);
        setErrorList(error.response.data.errors);
      }
    );
  };

  const clientChange = (e) => {
    customers.map((item) => {
      if (e === item.id) {
        if (
          item.attributes.tax_regimes.data &&
          item.attributes.tax_regimes.data.length
        ) {
          set_tax_system(
            item.attributes.tax_regimes.data[
              item.attributes.tax_regimes.data.length - 1
            ].attributes.catalog_tax_regime
          );
        } else {
          set_tax_system("");
        }
      }
    });
  };

  return (
    <>
      <PageHeader
        ghost
        title="CFDI Traslado"
        buttons={[
          <div key="6" className="page-header-actions">
            <Button size="small" key="4" type="primary" onClick={redirectBack}>
              <FeatherIcon icon="arrow-left" size={14} />
              Back
            </Button>
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <ToastContainer theme="colored" />
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: "calc(100vh - 320px)" }}>
                {spinner ? (
                  <div className="text-center">
                    <LoadingOutlined
                      style={{ fontSize: 40, color: "blue" }}
                      spin
                    />
                  </div>
                ) : (
                  <Formik
                    initialValues={data}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                      client: Yup.string().required("Se requiere la Cliente"),
                      currency: Yup.string().required(
                        "Se requiere la Currency"
                      ),
                      use: Yup.string().required("Se requiere la Use"),
                      date: Yup.string().required("Se requiere la Date"),
                    })}
                    onSubmit={(values, { setStatus, setSubmitting }) => {
                      setStatus();
                      if (conceptTableData.length) {
                        setBtnSpinner(true);
                        setErrorList([]);
                        let facturapi = { items: [] };
                        let cfdi = { cfdi_concepts_attributes: [] };
                        customers.map((item) => {
                          if (item.id === values.client) {
                            facturapi["customer"] = {
                              legal_name: item.attributes.name,
                              tax_id: item.attributes.rfc || "",
                              // "tax_system": tax_system,
                              // "tax_system": '616',
                              tax_system: tax_system.code,
                              address: {
                                zip:
                                  item.attributes.catalog_postal_code.name ||
                                  "",
                                street: item.attributes.street,
                                exterior: item.attributes.outside_number,
                                interior: item.attributes.inside_number,
                                neighborhood:
                                  item.attributes.catalog_colony.name,
                                municipality:
                                  item.attributes.catalog_municipality.name,
                                state: item.attributes.catalog_state.id,
                                country: item.attributes.catalog_country.code,
                              },
                              email: item.attributes.email || "",
                              phone: item.attributes.telephone || "",
                            };
                            cfdi["customer_id"] = item.id;
                            cfdi["catalog_tax_regime_id"] = tax_system.id;
                          }
                        });
                        facturapi["type"] = "T";
                        useOption.map((item) => {
                          if (item.id === values.use) {
                            facturapi["use"] = item.code;
                            cfdi["catalog_cfdi_use_id"] = item.id;
                          }
                        });
                        currencyOption.map((item) => {
                          if (item.id === values.currency) {
                            facturapi["currency"] = item.code;
                            cfdi["catalog_currency_id"] = item.id;
                          }
                        });
                        cfdi["exchange"] = "1";
                        facturapi["exchange"] = "1";
                        facturapi["date"] = moment(values.date).format(
                          "YYYY-MM-DD"
                        );
                        conceptTableData.map((item) => {
                          // CFDI Object
                          let cfdi_obj = {
                            product_service_id: item.product,
                            catalog_measurement_unit_id: item.measurementUnit
                              ? item.measurementUnit.split("/")[0]
                              : "",
                            description: item.description,
                            quantity: item.quantity,
                            price: item.unit_price || 0,
                            discount_percentage: item.discount || 0,
                            tax: item.tax || 0,
                            subtotal: item.subtotal || 0,
                            tax_rates_attributes: [],
                          };
                          if (item.tax_rate.length) {
                            item.tax_rate.map((rate) => {
                              cfdi_obj.tax_rates_attributes.push({
                                tax_rateable_type: "CfdiConcept",
                                catalog_tax_rate_id: rate,
                              });
                            });
                          }
                          cfdi.cfdi_concepts_attributes.push(cfdi_obj);
                          // FactureAPI Object
                          let facture_obj = {
                            product: {
                              description: item.description,
                              product_key:
                                item.productObj.code ||
                                item.productObj.attributes
                                  .catalog_product_service.code,
                              // "price": item.unit_price,
                              unit_key: item.measurementUnit.split("/")[1],
                              unit_name: item.measurementUnit.split("/")[2],
                              taxes: [],
                            },
                            quantity: item.quantity,
                            discount: item.discount || 0,
                            customs_keys: [],
                          };
                          facturapi.items.push(facture_obj);
                        });
                        cfdi["version"] = isPrefill ? "4.0" : "3.3";
                        submitCFDI({
                          facturapi,
                          cfdi,
                          version: isPrefill ? "4.0" : "3.3",
                        });
                      } else {
                        let list = [...errorList];
                        list.push(
                          "Please fill up atleast one row in Conceptos Del Flete"
                        );
                        setErrorList(list);
                      }
                    }}
                    render={({ values, handleChange, handleBlur }) => (
                      <Form>
                        <>
                          <Row className="ant-row mt-4 card_container">
                            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                              <FormGroup>
                                <div>
                                  <Label className="form-label">
                                    Cliente<span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="client">
                                    <Select
                                      showSearch
                                      name="client"
                                      onBlur={handleBlur}
                                      placeholder="Cliente"
                                      disabled={isPrefill}
                                      className={"form-control p-0"}
                                      value={values.client}
                                      onChange={(e) => {
                                        handleChange(e);
                                        clientChange(e);
                                      }}
                                      filterOption={(input, option) => {
                                        if (
                                          typeof option.children == "object"
                                        ) {
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
                                      {customers.length > 0 &&
                                        customers.map((item, index) => {
                                          return (
                                            <Select.Option
                                              value={item.id}
                                              key={index}
                                            >
                                              {item.attributes.name}
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
                                    Type<span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="type">
                                    <Field
                                      name="type"
                                      type="text"
                                      readOnly={true}
                                      className={"form-control"}
                                      onChange={handleChange}
                                      value={values.type}
                                    />
                                  </FormItem>
                                </div>
                              </FormGroup>
                            </div>
                            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                              <FormGroup>
                                <div>
                                  <Label className="form-label">
                                    Currency<span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="currency">
                                    <Select
                                      showSearch
                                      name="currency"
                                      onBlur={handleBlur}
                                      disabled={isPrefill}
                                      placeholder="Currency"
                                      className={"form-control p-0"}
                                      value={values.currency}
                                      onChange={handleChange}
                                      filterOption={(input, option) => {
                                        if (
                                          typeof option.children == "object"
                                        ) {
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
                                      {currencyOption.length > 0 &&
                                        currencyOption.map((item, index) => {
                                          return (
                                            <Select.Option
                                              value={item.id}
                                              key={index}
                                            >
                                              {item.code} - {item.name}
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
                                    Use<span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="use">
                                    <Select
                                      showSearch
                                      name="use"
                                      onBlur={handleBlur}
                                      placeholder="Use"
                                      className={"form-control p-0"}
                                      disabled={alreadyCreated}
                                      value={values.use}
                                      onChange={handleChange}
                                      filterOption={(input, option) => {
                                        if (
                                          typeof option.children == "object"
                                        ) {
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
                                      {useOption.length > 0 &&
                                        useOption.map((item, index) => {
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
                            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                              <FormGroup>
                                <Label className="form-label">
                                  Date<span className="red-color">*</span>
                                </Label>
                                <div>
                                  <DatePicker
                                    name="date"
                                    disabled={alreadyCreated}
                                    disabledDate={disabledDate}
                                    className={"date-picker-custom-style"}
                                    onChange={(v) => {
                                      setData({
                                        ...values,
                                        date: v,
                                      });
                                    }}
                                    value={values.date}
                                  />
                                </div>
                              </FormGroup>
                            </div>
                          </Row>
                          <FleteConcepts
                            columns={conceptTableColumns}
                            tableData={conceptTableData}
                            isFlete={false}
                            setProductOptions={setProductOptions}
                            measurementOption={measurementOption}
                            requiredFields={[
                              "description",
                              "quantity",
                              "product",
                              "measurementUnit",
                            ]}
                            isTranslado={true}
                            isPrefill={isPrefill}
                            setMeasurementOption={setMeasurementOption}
                            defaultMeasurement={defaultMeasurement}
                            setTableData={setConceptTableData}
                            productOptions={productOptions}
                            taxRateOptions={taxRateOptions}
                          />
                          {Array.isArray(errorList) && errorList.length > 0 ? (
                            <Row>
                              {errorList.map((item, index) => {
                                return (
                                  <Col md={24} key={index}>
                                    <div
                                      className={"alert alert-danger m-0 mt-2"}
                                    >
                                      {item}
                                    </div>
                                  </Col>
                                );
                              })}
                            </Row>
                          ) : (
                            <></>
                          )}
                          <Row className={"mb-2 mt-2"}>
                            <Col md={12}>
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
                                    disabled={alreadyCreated}
                                    className={`entityBtn ${
                                      alreadyCreated ? "opacity-50" : ""
                                    }`}
                                    type="submit"
                                    value="Salvar"
                                  />
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
                      </Form>
                    )}
                  />
                )}
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default TransladoContainer;
