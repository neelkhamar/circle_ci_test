import { Field } from "formik";
import { FormItem, Select } from "formik-antd";
import React from "react";
import { FormGroup, Label, Row } from "reactstrap";
import { CountryData } from "../../Common/Data/countries";

const Information = ({
  handleBlur,
  handleChange,
  values,
  errors,
  typeOptions,
  country,
  touched,
  setData,
  data,
}) => {
  const getEmoji = (code) => {
    if (code) {
      return CountryData[code] ? CountryData[code].emoji : "";
    }
  };

  const internationalHandler = (e) => {
    if (!e.target.checked) {
      setData({
        ...values,
        internationalType: "",
        internationalEntry: "",
        destInternational: "",
      });
    }
    handleChange(e);
  };

  return (
    <Row className="ant-row mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
        <span className="ant-page-header-heading-title">
          Informacion para translado internacional
        </span>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <FormItem name="international">
            <label className="pt-4 pb-3">
              <Field
                type="checkbox"
                name="international"
                className="mr-3"
                checked={values.international}
                onChange={internationalHandler}
              />
              <b>Translado internacional</b>
            </label>
          </FormItem>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Tipo de traslado internacional
            {values.international ? <span className="red-color">*</span> : ""}
          </Label>
          <FormItem name="internationalType">
            <Select
              name="internationalType"
              id="internationalType"
              onBlur={handleBlur}
              placeholder="Tipo de traslado internacional"
              className={"form-control p-0"}
              value={values.internationalType}
              onChange={handleChange}
            >
              <Select.Option value={1}>Entrada</Select.Option>
              <Select.Option value={2}>Salida</Select.Option>
            </Select>
          </FormItem>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Via de Entrada o salida Internacional
            {values.international ? <span className="red-color">*</span> : ""}
          </Label>
          <FormItem name="internationalEntry">
            <Select
              name="internationalEntry"
              id="internationalEntry"
              onBlur={handleBlur}
              placeholder="Via de Entrada o salida Internacional"
              className={"form-control p-0"}
              value={values.internationalEntry}
              onChange={handleChange}
            >
              {typeOptions.length > 0 &&
                typeOptions.map((item, index) => {
                  return (
                    <Select.Option value={item.value} key={index}>
                      {item.label}
                    </Select.Option>
                  );
                })}
            </Select>
          </FormItem>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Pais origen/destino internacional
            {values.international ? <span className="red-color">*</span> : ""}
          </Label>
          <FormItem name="destInternational">
            <Select
              name="destInternational"
              id="destInternational"
              onBlur={handleBlur}
              placeholder="Pais origen/destino internacional"
              className={"form-control p-0"}
              value={values.destInternational}
              onChange={handleChange}
            >
              {country.length > 0 &&
                country.map((item, index) => {
                  return (
                    <Select.Option value={item.catalog_country.id} key={index}>
                      {getEmoji(item.catalog_country.code2)}{" "}
                      {item.catalog_country.code +
                        " - " +
                        item.catalog_country.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </FormItem>
        </FormGroup>
      </div>
    </Row>
  );
};

export default React.memo(Information);
