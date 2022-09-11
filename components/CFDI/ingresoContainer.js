import { Button, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { Cards } from "../cards/frame/cards-frame";
import { PageHeader } from "../page-headers/page-headers";
// import { Button } from '../buttons/buttons';
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
import alertContainer from "../../utils/Alert";
import FleteConcepts from "../Flete/fleteConcepts";
import { Main } from "./styled";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const IngresoContainer = () => {
  const router = useRouter();

  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [conceptTableData, setConceptTableData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [taxRateOptions, setTaxRateOptions] = useState([]);
  const [paymentMethodOption, setPaymentMethodOption] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [useOption, setUseOption] = useState([]);
  const [measurementOption, setMeasurementOption] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [defaultMeasurement, setDefaultMeasurement] = useState(null);
  const [tax_system, set_tax_system] = useState("");
  const [data, setData] = useState({
    type: "Ingreso",
    paymentMethod: undefined,
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

  const exportOption = [
    {
      id: "01",
      value: "No aplica",
    },
    {
      id: "02",
      value: "Definitiva con clave A1",
    },
    {
      id: "03",
      value: "Temporal",
    },
    {
      id: "04",
      value:
        "Definitiva con clave distinta a A1 o cuando no existe enajenación en términos del CFF",
    },
  ];

  const redirectBack = () => {
    router.push("/cfdi/");
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchOptions();
    }

    return () => (mounted = false);
  }, []);

  const fetchOptions = () => {
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
          setPayments(response.data.catalog_payment_forms);
          setPaymentMethodOption(response.data.catalog_cfdi_payment_methods);
          setCurrencyOption(response.data.catalog_currencies);
          setUseOption(response.data.catalog_cfdi_uses);
          setDefaultMeasurement(response.data.measurement_unit_default);
          setMeasurementOption([response.data.measurement_unit_default]);
          setProductOptions(response.data.product_services.data);
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
        title="CFDI Ingreso"
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
                      payment: Yup.string().required("Se requiere la Payment"),
                      paymentMethod: Yup.string().required(
                        "Se requiere la Payment Method"
                      ),
                      currency: Yup.string().required(
                        "Se requiere la Currency"
                      ),
                      use: Yup.string().required("Se requiere la Use"),
                      date: Yup.string().required("Se requiere la Date"),
                    })}
                    onSubmit={(values, { setStatus, setSubmitting }) => {
                      setStatus();
                      console.log(values, conceptTableData);
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
                        payments.map((item) => {
                          if (item.id === values.payment) {
                            facturapi["payment_form"] = item.code;
                            cfdi["catalog_payment_form_id"] = item.id;
                          }
                        });
                        facturapi["type"] = "I";
                        facturapi["export"] = values.export;
                        paymentMethodOption.map((item) => {
                          if (item.id === values.paymentMethod) {
                            facturapi["payment_method"] = item.code;
                            cfdi["catalog_cfdi_payment_method_id"] = item.id;
                          }
                        });
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
                            price: item.unit_price,
                            discount_percentage: item.discount || 0,
                            tax: item.tax,
                            subtotal: item.subtotal,
                            tax_rates_attributes: [],
                          };
                          if (item.tax_rate.length) {
                            item.tax_rate.map((val) => {
                              cfdi_obj.tax_rates_attributes.push({
                                tax_rateable_type: "CfdiConcept",
                                catalog_tax_rate_id: val,
                              });
                            });
                          }
                          cfdi.cfdi_concepts_attributes.push(cfdi_obj);

                          // FactureAPI Object
                          let facture_obj = {
                            product: {
                              description: item.description,
                              product_key:
                                item.productObj.attributes
                                  .catalog_product_service.code,
                              price: item.unit_price,
                              unit_key: item.measurementUnit.split("/")[1],
                              unit_name: item.measurementUnit.split("/")[2],
                              taxes: [],
                            },
                            quantity: item.quantity,
                            discount: item.discount || 0,
                            customs_keys: [],
                          };
                          if (item.tax_rate.length) {
                            item.tax_rate.map((val) => {
                              taxRateOptions.map((x) => {
                                if (x.id === val) {
                                  facture_obj.product.taxes.push({
                                    rate: parseFloat(x.rate) / 100,
                                    type: x.tax_rate_type,
                                    factor: x.factor,
                                    withholding: x.withholding,
                                  });
                                }
                              });
                            });
                          }
                          facturapi.items.push(facture_obj);
                        });
                        cfdi["version"] = "4.0";
                        submitCFDI({ facturapi, cfdi, version: "4.0" });
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
                                    Payment Form
                                    <span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="payment">
                                    <Select
                                      showSearch
                                      name="payment"
                                      onBlur={handleBlur}
                                      placeholder="Payment"
                                      className={"form-control p-0"}
                                      value={values.payment}
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
                                      {payments.length > 0 &&
                                        payments.map((item, index) => {
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
                                    Payment Method
                                    <span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="paymentMethod">
                                    <Select
                                      name="paymentMethod"
                                      onBlur={handleBlur}
                                      placeholder="Payment Method"
                                      className={"form-control p-0"}
                                      value={values.paymentMethod}
                                      onChange={handleChange}
                                    >
                                      {paymentMethodOption.length > 0 &&
                                        paymentMethodOption.map(
                                          (item, index) => {
                                            return (
                                              <Select.Option
                                                value={item.id}
                                                key={index}
                                              >
                                                {item.code} - {item.name}
                                              </Select.Option>
                                            );
                                          }
                                        )}
                                    </Select>
                                  </FormItem>
                                </div>
                              </FormGroup>
                            </div>
                            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
                              <FormGroup>
                                <div>
                                  <Label className="form-label">
                                    Exportacion
                                    <span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="export">
                                    <Select
                                      name="export"
                                      onBlur={handleBlur}
                                      placeholder="Exportacion"
                                      className={"form-control p-0"}
                                      value={values.export}
                                      onChange={handleChange}
                                    >
                                      {exportOption.length > 0 &&
                                        exportOption.map((item, index) => {
                                          return (
                                            <Select.Option
                                              value={item.id}
                                              key={index}
                                            >
                                              {item.value}
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
                                    Currency<span className="red-color">*</span>
                                  </Label>
                                  <FormItem name="currency">
                                    <Select
                                      showSearch
                                      name="currency"
                                      onBlur={handleBlur}
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
                            requiredFields={[
                              "description",
                              "quantity",
                              "unit_price",
                              "product",
                              "measurementUnit",
                            ]}
                            setProductOptions={setProductOptions}
                            measurementOption={measurementOption}
                            setMeasurementOption={setMeasurementOption}
                            defaultMeasurement={defaultMeasurement}
                            setTableData={setConceptTableData}
                            productOptions={productOptions}
                            taxRateOptions={taxRateOptions}
                          />
                          {errorList.length > 0 ? (
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
                                    className="entityBtn"
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

export default IngresoContainer;
