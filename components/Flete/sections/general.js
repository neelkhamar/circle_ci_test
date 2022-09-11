import { FormItem, Select } from "formik-antd";
import React from "react";
import { FormGroup, Label, Row } from "reactstrap";

const General = ({
  handleBlur,
  handleChange,
  values,
  errors,
  typeOptions,
  currency,
  touched,
}) => {
  const { Option } = Select;

  return (
    <Row className="ant-row mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
        <span className="ant-page-header-heading-title">
          Informacion general del flete
        </span>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Tipo Carta Porte<span className="red-color">*</span>
          </Label>
          <FormItem name="type">
            <Select
              name="type"
              onBlur={handleBlur}
              placeholder="Tipo Carta Porte"
              className={"form-control p-0"}
              value={values.type}
              onChange={handleChange}
            >
              {typeOptions.map((item, index) => {
                return (
                  <Select.Option key={index} value={item.value}>
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
            Moneda<span className="red-color">*</span>
          </Label>
          <FormItem name="currency">
            <Select
              name="currency"
              id="currency"
              onBlur={handleBlur}
              placeholder="Moneda"
              className={"form-control p-0"}
              value={currency.length ? values.currency : ""}
              onChange={handleChange}
            >
              {currency.length > 0 &&
                currency.map((item, index) => {
                  return (
                    <Select.Option value={item.catalog_currency.id} key={index}>
                      {item.catalog_currency.code +
                        " - " +
                        item.catalog_currency.name}
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

export default React.memo(General);
