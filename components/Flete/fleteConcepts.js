import { Select, Tooltip } from "antd";
import FeatherIcon from "feather-icons-react";
import { Field } from "formik";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormGroup, Row } from "reactstrap";
import { measurementUnitSearch } from "../../requests/product";
import { Button } from "../buttons/buttons";

const FleteConcepts = ({
  columns,
  isFileUploaded,
  tableData,
  setTableData,
  productOptions,
  taxRateOptions,
  isFlete,
  setMeasurementOption,
  measurementOption,
  requiredFields,
  isTranslado,
  isPrefill,
  conceptosError,
}) => {
  const { Option } = Select;
  const [currentData, setCurrentData] = useState({
    product: "",
    description: "",
    quantity: "",
    unit_price: "",
    tax_rate: [],
    tax: "",
    discount: "",
    subtotal: "",
    productObj: null,
  });
  const [requiredList, setRequiredList] = useState([]);
  const [showError, setShowError] = useState(false);
  const [tax_rate_const_option, set_tax_rate_const_option] = useState({});
  const [selectedRow, setSelectedRow] = useState("");
  const [unitDropdownSpinner, setUnitDropdownSpinner] = useState(false);
  const [pricing, setPricing] = useState({
    subTotal: "0.00",
    discount: 0,
    tax: 0,
    total: "0.00",
    total_units: 0,
    subTaxes: {},
  });
  const [validation, setValidation] = useState(false);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const onSearch = (value) => {
    if (value.length >= 3) {
      setUnitDropdownSpinner(true);
      measurementUnitSearch(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        value
      ).then(
        (response) => {
          setUnitDropdownSpinner(false);
          setMeasurementOption(response.data.data);
        },
        (error) => {
          setUnitDropdownSpinner(false);
        }
      );
    }
  };

  useEffect(() => {
    setRequiredList(requiredFields);
  }, [requiredFields]);

  useEffect(() => {
    if (taxRateOptions.length) {
      let obj = {};
      let taxes = {};
      taxRateOptions.map((item) => {
        obj[item.id.toString()] = {
          title: item.name,
          value: parseInt(item.rate),
          add: !item.name.includes("Retencion"),
        };
        taxes[item.id.toString()] = [];
      });
      set_tax_rate_const_option(obj);
      setPricing({
        ...pricing,
        subTaxes: taxes,
      });
    }
  }, [taxRateOptions]);

  const addRow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let valid = true;
    let keys = Object.keys(currentData);
    keys.map((item) => {
      if (requiredList.includes(item) && !currentData[item]) {
        valid = false;
      }
    });
    if (valid) {
      setShowError(false);
      let data = [...tableData];
      let payload = { ...currentData };
      if (selectedRow) {
        // Update Scenario
        data.map((val) => {
          if (val.id === selectedRow) {
            val["product"] = currentData.product;
            val["description"] = currentData.description;
            val["quantity"] = currentData.quantity;
            val["unit_price"] = currentData.unit_price;
            val["tax_rate"] = currentData.tax_rate;
            val["tax"] = currentData.tax;
            val["discount"] = currentData.discount;
            val["subtotal"] = currentData.subtotal;
            val["productObj"] = currentData.productObj;
            val["measurementUnit"] = currentData.measurementUnit;
          }
        });
        setTableData(data);
        resetForm();
      } else {
        // Add Scenario
        payload["id"] = Date.now();
        payload["new"] = true;
        data.push(payload);
        setTableData(data);
        resetForm();
      }
    } else {
      setShowError(true);
    }
  };

  const resetForm = () => {
    setCurrentData({
      ...currentData,
      product: "",
      description: "",
      quantity: "",
      unit_price: "",
      tax_rate: [],
      tax: "",
      discount: "",
      subtotal: "",
      productObj: "",
      measurementUnit: "",
    });
    setSelectedRow("");
  };

  useEffect(() => {
    let sTotal = [];
    let taxes = [];
    let disc = [];
    let subTax;
    let valid = false;
    if (Object.keys(pricing.subTaxes).length) {
      subTax = { ...pricing.subTaxes };
      valid = true;
    }
    if (valid) {
      let qty = [];
      if (tableData.length) {
        tableData.map((item) => {
          sTotal.push(parseInt(item.subtotal || 0));
          taxes.push(parseInt(item.tax || 0));
          qty.push(parseInt(item.quantity));
          if (item.discount) {
            disc.push((sTotal * item.discount) / 100);
          }
          if (item.tax_rate.length > 0) {
            item.tax_rate.map((x) => {
              let v = (item.subtotal * tax_rate_const_option[x].value) / 100;
              if (item.discount > 0) {
                v = v - (v * item.discount) / 100;
              }
              subTax[x].push(v);
            });
          }
        });
        let total = sTotal.reduce((a, b) => a + b, 0);
        let tax = taxes.reduce((a, b) => a + b, 0);
        let discount = disc.reduce((a, b) => a + b, 0);
        setPricing({
          ...pricing,
          subTotal: total,
          tax: tax,
          discount: discount,
          total: parseFloat(total + tax - discount),
          subTaxes: subTax,
          total_units: qty.reduce((a, b) => a + b, 0),
        });
      } else {
        setPricing({
          ...pricing,
          subTotal: 0,
          discount: 0,
          tax: 0,
          total: 0,
          subTaxes: subTax,
          total_units: 0,
        });
      }
    }
  }, [tableData]);

  const getSum = (arr) => {
    return arr.reduce((a, b) => a + b, 0);
  };

  useEffect(() => {
    if (currentData.quantity && currentData.unit_price) {
      let total =
        parseFloat(currentData.quantity) * parseFloat(currentData.unit_price);
      let value = 0;
      if (
        currentData.quantity &&
        currentData.unit_price &&
        currentData.tax_rate.length > 0
      ) {
        currentData.tax_rate.map((item) => {
          if (tax_rate_const_option[item].add) {
            value = value + (total * tax_rate_const_option[item].value) / 100;
          } else {
            value = value - (total * tax_rate_const_option[item].value) / 100;
          }
        });
      }
      if (currentData.discount) {
        value = value - (value * currentData.discount) / 100;
      }
      setCurrentData({
        ...currentData,
        subtotal: total,
        tax: value,
      });
    }
  }, [
    currentData.quantity,
    currentData.unit_price,
    currentData.tax_rate,
    currentData.discount,
  ]);

  useEffect(() => {
    let error = false;
    if (
      (currentData.description && currentData.description.length > 255) ||
      (currentData.quantity && parseInt(currentData.quantity) === 0)
    ) {
      error = true;
    }
    setValidation(error);
  }, [currentData]);

  const inputHandler = (e, val) => {
    setCurrentData({
      ...currentData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const selectHandler = (key, values) => {
    setCurrentData({
      ...currentData,
      [key]: values,
    });
  };

  const removeRow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFileUploaded) {
      let data = tableData.filter((val) => val.id !== item.id);
      setTableData(data);
    }
  };

  const getRows = (index, arr) => {
    return (
      <tr key={index} style={{ fontSize: "12px", fontWeight: "lighter" }}>
        <th>{tax_rate_const_option[index].title}:</th>
        <td>
          {tax_rate_const_option[index].add ? "" : "-"} ${getSum(arr)}
        </td>
      </tr>
    );
  };

  const getMeasurementOption = (measurement) => {
    let unit = measurement.split("/");
    const code = unit[1];
    const name = unit[2];
    const id = unit[0];
    return (
      <Select.Option value={id + "/" + code + "/" + name}>
        {code + " - " + name}
      </Select.Option>
    );
  };

  const editRow = (e, data) => {
    setSelectedRow(data.id);
    if (!isFlete) {
      let unit = data.measurementUnit.split("/");
      setMeasurementOption([
        {
          code: unit[1],
          name: unit[2],
          id: unit[0],
        },
      ]);
    }
    setCurrentData({
      ...currentData,
      product: data.product,
      description: data.description,
      quantity: data.quantity,
      unit_price: data.unit_price,
      tax_rate: data.tax_rate,
      tax: data.tax,
      discount: data.discount,
      subtotal: data.subtotal,
      productObj: !isFlete ? data.productObj : "",
      measurementUnit: !isFlete ? data.measurementUnit : "",
    });
  };

  const productChangeHandler = (val) => {
    let product = null;
    productOptions.map((item) => {
      if (val === item.id) {
        product = item;
      }
    });
    if (product) {
      if (isFlete) {
        let taxRate = [];
        if (product.tax_rates.length > 0) {
          product.tax_rates.map((item) => {
            taxRate.push(item.catalog_tax_rate.id);
          });
        }
        setCurrentData({
          ...currentData,
          description: product.catalog_product_service.name,
          quantity: 1,
          unit_price: product.selling_price,
          product: product.id,
          tax_rate: taxRate,
        });
      } else {
        let { code, id, name } = product.catalog_measurement_unit;
        let obj = {
          ...currentData,
          description: product.catalog_product_service.name,
          quantity: 1,
          product: product.id,
          productObj: product,
        };
        if (!currentData.product) {
          obj["measurementUnit"] = id + "/" + code + "/" + name;
        }
        let options = [...measurementOption];
        options.push(product.catalog_measurement_unit);
        setMeasurementOption(options);
        setCurrentData(obj);
      }
    }
  };

  const unitChange = (val) => {
    let unit = null;
    measurementOption.map((item) => {
      let compare = item.id + "/" + item.code + "/" + item.name;
      if (val === compare) {
        unit = item;
      }
    });
    setCurrentData({
      ...currentData,
      measurementUnit: unit.id + "/" + unit.code + "/" + unit.name,
    });
  };

  const fetchRows = useCallback(
    (index) => {
      return (
        <Fragment key={index}>
          <tr>
            <td className="p-2">
              <FormGroup>
                <Select
                  name="product"
                  className={
                    "form-control static-width p-0" +
                    (showError && !currentData.product ? " is-invalid" : "")
                  }
                  value={currentData.product}
                  onChange={(val) => productChangeHandler(val)}
                >
                  {productOptions.map((val, index) => {
                    return (
                      <Select.Option key={index} value={val.id}>
                        {val.catalog_product_service.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </td>
            {!isFlete && (
              <td className="p-2">
                <FormGroup>
                  <Select
                    showSearch
                    name="catalog_product_service_id"
                    className={
                      "form-control p-0" +
                      (requiredList.includes("measurementUnit") &&
                      showError &&
                      !currentData.measurementUnit
                        ? " is-invalid"
                        : "")
                    }
                    disabled={isPrefill}
                    filterOption={false}
                    onChange={(val) => unitChange(val)}
                    value={currentData.measurementUnit}
                    notFoundContent={
                      unitDropdownSpinner.product ? (
                        <div className="text-center">
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "blue" }}
                            spin
                          />
                        </div>
                      ) : null
                    }
                    onSearch={(val) => onSearch(val)}
                  >
                    {measurementOption.length > 0 &&
                      measurementOption.map((item, index) => {
                        return (
                          <Select.Option
                            value={item.id + "/" + item.code + "/" + item.name}
                            key={index}
                          >
                            {item.code + " - " + item.name}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </FormGroup>
              </td>
            )}
            <td className="p-2">
              <FormGroup>
                <Field
                  name="description"
                  type="text"
                  readOnly={isPrefill}
                  className={
                    "form-control static-width" +
                    ((requiredList.includes("description") &&
                      showError &&
                      !currentData.description) ||
                    (validation && currentData.description.length > 255)
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.description}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="quantity"
                  type="number"
                  readOnly={isPrefill}
                  className={
                    "form-control static-width" +
                    ((requiredList.includes("quantity") &&
                      showError &&
                      !currentData.quantity) ||
                    (validation && parseInt(currentData.quantity) === 0)
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.quantity}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="unit_price"
                  type="text"
                  // readOnly={isTranslado}
                  className={
                    "form-control static-width" +
                    (requiredList.includes("unit_price") &&
                    showError &&
                    !currentData.unit_price
                      ? " is-invalid"
                      : "")
                  }
                  onChange={inputHandler}
                  value={currentData.unit_price}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Select
                  showSearch
                  name="tax_rate"
                  type="number"
                  mode="multiple"
                  // disabled={isTranslado}
                  className={"form-control static-width p-0"}
                  onChange={(e, val) => selectHandler("tax_rate", e)}
                  value={currentData.tax_rate}
                  filterOption={(input, option) => {
                    return option.children
                      .toLowerCase()
                      .includes(input.toLowerCase());
                  }}
                >
                  {taxRateOptions.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="tax"
                  type="number"
                  readOnly={true}
                  className={
                    "form-control static-width"
                    // +
                    // (showError && !currentData.tax ? " is-invalid" : "")
                  }
                  onChange={inputHandler}
                  value={currentData.tax}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="discount"
                  type="number"
                  // readOnly={isTranslado}
                  className={
                    "form-control static-width"
                    // +
                    // (showError && !currentData.discount ? " is-invalid" : "")
                  }
                  onChange={inputHandler}
                  value={currentData.discount}
                />
              </FormGroup>
            </td>
            <td className="p-2">
              <FormGroup>
                <Field
                  name="subtotal"
                  type="text"
                  readOnly={true}
                  className={
                    "form-control static-width"
                    // +
                    // (showError && !currentData.subtotal ? " is-invalid" : "")
                  }
                  onChange={inputHandler}
                  value={currentData.subtotal}
                />
              </FormGroup>
            </td>
            <td>
              {selectedRow ? (
                <p className="cancel_btn" onClick={resetForm}>
                  Cancel
                </p>
              ) : (
                ""
              )}
            </td>
          </tr>
          {selectedRow ? (
            <tr>
              <td colSpan={8}>
                <Button
                  size="small"
                  key="4"
                  className="add_file_btn mt-0"
                  onClick={addRow}
                  type="primary"
                >
                  Editar Registro
                </Button>
              </td>
            </tr>
          ) : (
            <></>
          )}
        </Fragment>
      );
    },
    [tableData, currentData, productOptions, taxRateOptions, measurementOption]
  );

  return (
    <Row className="mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3 d-flex justify-content-between">
        <span className="ant-page-header-heading-title">
          Conceptos del Flete
        </span>
      </div>
      <div
        className={`ant-col ant-col-xs-24 ant-col-xl-24 mt-4 table_pdf_container`}
      >
        <table className="flete_concept_table mt-4">
          <thead>
            <tr className="title">
              {columns.map((item, index) => (
                <th className="table_column_header" key={index}>
                  {requiredList.includes(item.key) ? (
                    <>
                      {item.label}
                      <span className="red-color">*</span>
                    </>
                  ) : (
                    item.label
                  )}
                </th>
              ))}
              <th className="table_column_header"></th>
            </tr>
          </thead>
          <tbody className={tableData.length === 0 ? "minHeight50" : ""}>
            {tableData.map((item, index) => {
              if (selectedRow === item.id) {
                return fetchRows(index);
              } else {
                return (
                  <tr
                    key={index}
                    className="border_bottom verticalAlignInitial"
                  >
                    <td className="static-width text-center p-2">
                      <Select
                        name="product"
                        disabled={true}
                        className={"form-control static-width p-0"}
                        value={item.product}
                      >
                        {productOptions.map((val, index) => {
                          return (
                            <Select.Option key={index} value={val.id}>
                              {val
                                ? val.catalog_product_service.name
                                : val.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </td>
                    {!isFlete ? (
                      <td className="static-width text-center p-2">
                        <Select
                          name="product"
                          disabled={true}
                          className={"form-control static-width p-0"}
                          value={item.measurementUnit}
                        >
                          {getMeasurementOption(item.measurementUnit)}
                        </Select>
                      </td>
                    ) : null}
                    <td className="static-width text-center p-2">
                      <Field
                        name="description"
                        type="text"
                        disabled={true}
                        className={"form-control static-width"}
                        value={item.description}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="quantity"
                        type="text"
                        disabled={true}
                        className={"form-control static-width"}
                        value={item.quantity}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="unit_price"
                        type="text"
                        disabled={true}
                        className={"form-control static-width"}
                        value={item.unit_price}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Select
                        name="tax_rate"
                        type="number"
                        mode="multiple"
                        disabled={true}
                        className={"form-control static-width p-0"}
                        value={item.tax_rate}
                      >
                        {taxRateOptions.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="tax"
                        type="number"
                        disabled={true}
                        className={"form-control static-width"}
                        value={item.tax}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="discount"
                        type="number"
                        disabled={true}
                        className={"form-control static-width"}
                        value={item.discount}
                      />
                    </td>
                    <td className="static-width text-center p-2">
                      <Field
                        name="subtotal"
                        type="number"
                        disabled={true}
                        className={"form-control static-width"}
                        value={item.subtotal}
                      />
                    </td>
                    <td
                      className={
                        "static-width text-center d-flex " +
                        (item.tax_rate.length > 1
                          ? item.tax_rate.length > 1
                            ? "pt-4"
                            : "pt-5"
                          : "pt-3")
                      }
                    >
                      {!isPrefill ? (
                        <Tooltip title="Edit">
                          <FeatherIcon
                            icon="edit"
                            onClick={(e) => editRow(e, item)}
                            size={15}
                          />
                        </Tooltip>
                      ) : null}
                      <Tooltip title="Remove">
                        <FeatherIcon
                          icon="trash"
                          onClick={(e) => removeRow(e, item)}
                          size={15}
                        />
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            })}
            {!selectedRow && !isPrefill ? fetchRows() : null}
          </tbody>
        </table>
      </div>
      {conceptosError && conceptosError.message ? (
        <div
          className="ant-col ant-col-xs-24 ant-col-xl-24"
          id="conceptos_error"
        >
          <div className={"alert alert-danger m-0 mt-3"}>
            {conceptosError.message}
          </div>
        </div>
      ) : (
        <></>
      )}
      {validation ? (
        <div className="mt-3 conceptos-error">
          <p className="p-0 m-0">Please resolve below errors</p>
          <ul>
            {currentData.description.length > 255 && (
              <li className="text-danger">
                Description should not be more than 255 characters
              </li>
            )}
            {parseInt(currentData.quantity) === 0 && (
              <li className="text-danger">Quantity should be greater than 0</li>
            )}
          </ul>
        </div>
      ) : (
        <></>
      )}
      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
        {!selectedRow && !isPrefill ? (
          <Button
            size="small"
            key="4"
            className="add_file_btn"
            disabled={isFileUploaded || validation}
            onClick={addRow}
            type="primary"
          >
            Agregar
          </Button>
        ) : (
          <></>
        )}
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3 text-right">
        <p className="text-left d-flex">
          <b className="mr-3">Filas: {tableData.length}</b>
          <b className="mr-3">Unidades: {pricing.total_units}</b>
        </p>
        <hr />
        <table className="pricing_table">
          <tbody>
            <tr>
              <th>Subtotal:</th>
              <td>${pricing.subTotal}</td>
            </tr>
            <tr>
              <th>Descuento:</th>
              <td>${pricing.discount}</td>
            </tr>
            <tr>
              <th>Impuesto:</th>
              <td>${pricing.tax}</td>
            </tr>
            {pricing.subTaxes &&
              Object.keys(pricing.subTaxes).map((val) => {
                if (pricing.subTaxes[val].length > 0) {
                  return getRows(val, pricing.subTaxes[val]);
                }
              })}
            <tr>
              <th className="border_top">Total:</th>
              <td className="border_top">
                <b>${pricing.total}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Row>
  );
};

export default React.memo(FleteConcepts);
