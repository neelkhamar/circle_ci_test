import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import {
  createProduct,
  getProductById,
  measurementUnitSearch,
  productSearch,
  taxRates,
  updateProduct,
} from "../../../requests/product";
import alertContainer from "../../../utils/Alert";
import { fetchHelperTaxRate } from "../../Helper/product";

function ProductModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const { Option } = Select;
  const { visible, handleCancel, handleOk, selectedProduct } = props;
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [apiTaxRates, setApiTaxRates] = useState([]);
  const [dropdownSpinner, setDropdownSpinner] = useState({
    product: false,
    measurement_unit: false,
  });
  const [productOptions, setProductOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [btnLabel, setBtnLabel] = useState("Crear Producto");

  const [data, setData] = useState({
    catalog_product_service_id: "",
    catalog_measurement_unit_id: "",
    selling_price: "",
    purchase_price: "",
    tax_rate: "",
  });

  const inputHandler = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (selectedProduct) {
        fetchProduct();
        setBtnLabel("Actualizar Producto");
      } else {
        fetchRates();
      }
    }

    return () => (mounted = false);
  }, []);

  const fetchProduct = () => {
    setSpinner(true);
    getProductById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      selectedProduct
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          let output = response.data;
          let rates = [];
          setProductOptions([output.catalog_product_service]);
          setUnitOptions([output.catalog_measurement_unit]);
          if (output.tax_rates.length) {
            output.tax_rates.map((item) => {
              rates.push(item.catalog_tax_rate.id);
            });
          }
          setApiTaxRates(output.tax_rates);
          setData({
            ...data,
            catalog_product_service_id: output.catalog_product_service.id,
            catalog_measurement_unit_id: output.catalog_measurement_unit.id,
            selling_price: output.selling_price,
            purchase_price: output.purchase_price,
            tax_rate: rates,
          });
          fetchRates();
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const fetchRates = () => {
    setSpinner(true);
    taxRates(currentUser.accessToken, currentUser.uid, currentUser.client).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          setTaxOptions(response.data.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const onSearch = (name, value) => {
    if (name === "product") {
      setProductOptions([]);
    } else {
      setUnitOptions([]);
    }
    if (value.length >= 3) {
      if (name === "product") {
        setDropdownSpinner({
          ...dropdownSpinner,
          product: true,
          measurement_unit: false,
        });
        productSearch(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          value
        ).then(
          (response) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              product: false,
            });
            setProductOptions(response.data.data);
          },
          (error) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              product: false,
            });
          }
        );
      } else {
        setDropdownSpinner({
          ...dropdownSpinner,
          measurement_unit: true,
          product: false,
        });
        measurementUnitSearch(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          value
        ).then(
          (response) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              measurement_unit: false,
            });
            setUnitOptions(response.data.data);
          },
          (error) => {
            setDropdownSpinner({
              ...dropdownSpinner,
              measurement_unit: false,
            });
          }
        );
      }
    }
  };

  const onSelect = (val, name) => {
    setData({
      ...data,
      [name]: val,
    });
  };

  return (
    <Modal
      className="entityModalContainer"
      title={selectedProduct ? "Actualizar Producto" : "Nuevo Producto"}
      visible={visible}
      onOk={handleOk}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[]}
    >
      {spinner ? (
        <div className="text-center pt-4">
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <Formik
          initialValues={data}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            catalog_product_service_id: Yup.string().required(
              "Se requiere la Producto"
            ),
            catalog_measurement_unit_id: Yup.string().required(
              "Se requiere la Unidad de medida"
            ),
            // selling_price: Yup.string().required('Se requiere la Precio de venta'),
            // purchase_price: Yup.string().required('Se requiere la Precio de compra')
          })}
          onSubmit={async (
            {
              catalog_product_service_id,
              catalog_measurement_unit_id,
              selling_price,
              purchase_price,
              tax_rate,
            },
            { setStatus, setSubmitting }
          ) => {
            setStatus();
            setBtnSpinner(true);
            let rateList = [];
            if (tax_rate.length) {
              if (selectedProduct) {
                rateList = await fetchHelperTaxRate(tax_rate, apiTaxRates);
              } else {
                tax_rate.map((item) => {
                  rateList.push({
                    tax_rateable_type: "ProductService",
                    catalog_tax_rate_id: item,
                  });
                });
              }
            }
            let payload = {
              product_service: {
                catalog_product_service_id: catalog_product_service_id,
                catalog_measurement_unit_id: catalog_measurement_unit_id,
                selling_price: selling_price ? parseFloat(selling_price) : 0,
                purchase_price: purchase_price ? parseFloat(purchase_price) : 0,
                tax_rates_attributes: rateList,
              },
            };
            if (selectedProduct) {
              updateProduct(
                currentUser.accessToken,
                currentUser.uid,
                currentUser.client,
                selectedProduct,
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
                  setBtnSpinner(false);
                  setErrorList(
                    error.response.data.errors || [
                      "Algo salió mal. Por favor, inténtelo de nuevo más tarde",
                    ]
                  );
                }
              );
            } else {
              createProduct(
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
                  setBtnSpinner(false);
                  setErrorList(
                    error.response.data.errors || [
                      "Algo salió mal. Por favor, inténtelo de nuevo más tarde",
                    ]
                  );
                }
              );
            }
          }}
          render={({
            values,
            errors,
            status,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <Form>
              <>
                <Row className="mt-3 ant-row">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <FormGroup>
                      <Label className="form-label">
                        Nombre del producto o servicio
                        <span className="red-color">*</span>
                      </Label>
                      <div>
                        <FormItem name="catalog_product_service_id">
                          <Select
                            showSearch
                            name="catalog_product_service_id"
                            className="form-control p-0"
                            placeholder="Buscar Producto"
                            filterOption={false}
                            onChange={(val) =>
                              onSelect(val, "catalog_product_service_id")
                            }
                            notFoundContent={
                              dropdownSpinner.product ? (
                                <div className="text-center">
                                  <LoadingOutlined
                                    style={{ fontSize: 18, color: "blue" }}
                                    spin
                                  />
                                </div>
                              ) : null
                            }
                            onSearch={(val) => onSearch("product", val)}
                          >
                            {productOptions.length > 0 &&
                              productOptions.map((item, index) => {
                                return (
                                  <Select.Option value={item.id} key={index}>
                                    {item.code + " - " + item.name}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <FormGroup>
                      <Label className="form-label">
                        Tasas de impuestos (%)
                      </Label>
                      <div>
                        <FormItem name="tax_rate">
                          <Select
                            showSearch
                            name="tax_rate"
                            className="form-control p-0"
                            placeholder="Tasas de impuestos"
                            mode="multiple"
                            onChange={(val) => onSelect(val, "tax_rate")}
                            filterOption={(input, option) => {
                              return (
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {taxOptions.length > 0 &&
                              taxOptions.map((item, index) => {
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
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <FormGroup>
                      <Label className="form-label">
                        Unidad de Medida<span className="red-color">*</span>
                      </Label>
                      <div>
                        <FormItem name="catalog_measurement_unit_id">
                          <Select
                            showSearch
                            name="catalog_measurement_unit_id"
                            onBlur={handleBlur}
                            className="form-control p-0"
                            placeholder="Buscar Measurement Unit"
                            filterOption={false}
                            onChange={(val) =>
                              onSelect(val, "catalog_measurement_unit_id")
                            }
                            notFoundContent={
                              dropdownSpinner.measurement_unit ? (
                                <div className="text-center">
                                  <LoadingOutlined
                                    style={{ fontSize: 18, color: "blue" }}
                                    spin
                                  />
                                </div>
                              ) : null
                            }
                            onSearch={(val) => onSearch("unit", val)}
                          >
                            {unitOptions.length > 0 &&
                              unitOptions.map((item, index) => {
                                return (
                                  <Select.Option value={item.id} key={index}>
                                    {item.code + " - " + item.name}
                                  </Select.Option>
                                );
                              })}
                          </Select>
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                    <FormGroup>
                      <Label className="form-label">Precio de venta</Label>
                      <Field
                        name="selling_price"
                        type="text"
                        className={"form-control"}
                        onChange={handleChange}
                        value={values.selling_price}
                        placeholder="Ingrese Precio de venta"
                      />
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                    <FormGroup>
                      <Label className="form-label">Precio de compra</Label>
                      <Field
                        name="purchase_price"
                        type="text"
                        className={"form-control"}
                        value={values.purchase_price}
                        onChange={handleChange}
                        placeholder="Ingrese Precio de compra"
                      />
                    </FormGroup>
                  </div>
                </Row>
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
                    <FormGroup>
                      {btnSpinner ? (
                        <Button className="entityBtnDuplicate" disabled={true}>
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
                          value={btnLabel}
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
    </Modal>
  );
}

export default ProductModal;
