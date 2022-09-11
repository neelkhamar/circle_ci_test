import { Field } from "formik";
import { FormItem, Select } from "formik-antd";
import React from "react";
import { FormGroup, Label, Row } from "reactstrap";

const Carrier = ({
  handleBlur,
  handleChange,
  values,
  errors,
  vehicles,
  sctTypes,
  touched,
}) => {
  const { Option } = Select;

  const handleSelect = (e) => {
    if (e.length < 3) {
      let obj = {
        target: {
          name: "remolque",
          value: e,
        },
      };
      handleChange(obj);
    }
  };

  return (
    <Row className="ant-row mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
        <span className="ant-page-header-heading-title">
          Datos para Autotransporte Federal
        </span>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Tipo Permiso SCT<span className="red-color">*</span>
          </Label>
          <FormItem name="sct">
            <Select
              name="sct"
              id="sct"
              onBlur={handleBlur}
              placeholder="Tipo Permiso SCT"
              className={"form-control p-0"}
              value={values.sct}
              onChange={handleChange}
            >
              {sctTypes.length > 0 &&
                sctTypes.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.code + " - " + item.name}
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
            Numero Permiso SCT<span className="red-color">*</span>
          </Label>
          <FormItem name="numberSct">
            <Field
              name="numberSct"
              id="numberSct"
              placeholder="Ingrese Numero Permiso SCT"
              type="text"
              className={"form-control"}
              value={values.numberSct}
              onChange={handleChange}
            />
          </FormItem>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Vehiculo<span className="red-color">*</span>
          </Label>
          <FormItem name="vehicles">
            <Select
              name="vehicles"
              id="vehicles"
              onBlur={handleBlur}
              placeholder="Vehiculo"
              className={"form-control p-0"}
              value={values.vehicles}
              onChange={handleChange}
            >
              {vehicles.length > 0 &&
                vehicles.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.model + " " + item.brand}
                    </Select.Option>
                  );
                })}
            </Select>
          </FormItem>
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">Remolques</Label>
          <FormItem name="remolque">
            <Select
              name="remolque"
              onBlur={handleBlur}
              mode={"multiple"}
              maxTagCount={3}
              placeholder="Remolque"
              className={"form-control p-0"}
              value={values.remolque}
              onChange={handleSelect}
            >
              {vehicles.length > 0 &&
                vehicles.map((item, index) => {
                  return (
                    <Select.Option
                      disabled={
                        values.remolque && values.remolque.length > 1
                          ? values.remolque.includes(item.id)
                            ? false
                            : true
                          : false
                      }
                      value={item.id}
                      key={index}
                    >
                      {item.model + " " + item.brand}
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

export default React.memo(Carrier);
