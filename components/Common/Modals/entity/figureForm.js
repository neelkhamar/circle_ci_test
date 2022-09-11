import { DatePicker, Switch } from "antd";
import { Field, FormItem, Select } from "formik-antd";
import { useState } from "react";
import { FormGroup, Label, Row, Spinner } from "reactstrap";

const FigureForm = ({
  isManual,
  setIsManual,
  typeOptions,
  isValid,
  data,
  setData,
  handleBlur,
  errors,
  touched,
  curpError,
  values,
  spinner,
  selectedFigure,
  resetValues,
  handleChange,
  fetchCurp,
}) => {
  const validateRFC = (val) => {
    let error;
    if (val && !/^[A-Z]{3,4}[0-9]{6}[0-9A-Z]{3}$/i.test(val)) {
      error = "Introduzca un RFC válido";
    }
    return error;
  };

  const validateCurp = (val) => {
    let error;
    if (
      val &&
      !/^[A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}([A-Z]{2})?([0-9]{2})?$/i.test(
        val
      )
    ) {
      error = "Introduzca un CURP válido";
    }
    return error;
  };

  const trackCurp = (val) => {
    if (val.length == 18 && !isManual && !selectedFigure) {
      fetchCurp(val);
    }
  };

  return (
    <>
      <Row className="mt-3 ant-row">
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2 mb-3 d-flex">
          <Switch
            checked={isManual}
            className="mr-3"
            disabled={selectedFigure}
            onChange={(val) => {
              setIsManual(val);
              resetValues();
            }}
          />
          <h5>Ingresar manualmente</h5>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
          <FormGroup>
            <Label className="form-label">
              CURP<span className="red-color">*</span>
            </Label>
            <FormItem name="curp" className="m-0 d-flex">
              <Field
                name="curp"
                type="text"
                autoComplete="off"
                validate={validateCurp}
                disabled={isValid}
                value={values.curp}
                onChange={(e) => {
                  handleChange(e);
                  trackCurp(e.target.value);
                }}
                className={"form-control"}
                placeholder="Ingrese CURP"
              />
              {spinner ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="m-3"
                ></Spinner>
              ) : (
                <></>
              )}
            </FormItem>
            {!errors.curp && !touched.curp && curpError && (
              <div className="invalid-feedback d-block font14">
                La curva ingresada no es válida
              </div>
            )}
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
          <FormGroup>
            <Label className="form-label">
              Nombre<span className="red-color">*</span>
            </Label>
            <FormItem name="name" className="m-0">
              <Field
                name="name"
                type="text"
                readOnly={!isManual}
                className={"form-control"}
                value={values.name}
                onChange={(e) => handleChange(e)}
                placeholder="Ingrese Nombre"
              />
            </FormItem>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
          <FormGroup>
            <Label className="form-label">
              Apellido Paterno<span className="red-color">*</span>
            </Label>
            <FormItem name="last_name" className="m-0">
              <Field
                name="last_name"
                type="text"
                readOnly={!isManual}
                className={"form-control"}
                value={values.last_name}
                onChange={(e) => handleChange(e)}
                placeholder="Ingrese Apellido Paterno"
              />
            </FormItem>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
          <FormGroup>
            <Label className="form-label">
              Apellido Materno<span className="red-color">*</span>
            </Label>
            <FormItem name="second_last_name" className="m-0">
              <Field
                name="second_last_name"
                type="text"
                readOnly={!isManual}
                className={"form-control"}
                value={values.second_last_name}
                onChange={(e) => handleChange(e)}
                placeholder="Ingrese Apellido Materno"
              />
            </FormItem>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
          <FormGroup>
            <Label className="form-label">
              Sexo<span className="red-color">*</span>
            </Label>
            {isManual ? (
              <FormItem name="gender" className="m-0">
                <Select
                  name="gender"
                  onBlur={handleBlur}
                  placeholder="Sexo"
                  className={"form-control p-0"}
                  value={values.gender}
                  onChange={(val) => handleChange(val)}
                >
                  <Select.Option value="HOMBRE">Hombre</Select.Option>
                  <Select.Option value="MUJER">Mujer</Select.Option>
                </Select>
              </FormItem>
            ) : (
              <Field
                name="gender"
                type="text"
                readOnly={true}
                className={"form-control"}
                placeholder="Seleccionar sexo"
              />
            )}
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
          <FormGroup>
            <Label className="form-label">
              Fecha de nacimiento<span className="red-color">*</span>
            </Label>
            <FormItem name="birthday" className="m-0">
              <DatePicker
                name="birthday"
                disabled={!isManual}
                className={"form-control marginRight1 custom-birthday-picker"}
                placeholder="Seleccionar Date"
                onChange={(e) => handleChange(e)}
                value={values.birthday}
              />
            </FormItem>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
          <FormGroup>
            <Label className="form-label">
              RFC<span className="red-color">*</span>
            </Label>
            <FormItem name="rfc" className="m-0">
              <Field
                name="rfc"
                type="text"
                validate={validateRFC}
                className={"form-control"}
                autoComplete="off"
                value={values.rfc}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Ingrese RFC"
              />
            </FormItem>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
          <FormGroup>
            <Label className="form-label">
              Licencia de manejo<span className="red-color">*</span>
            </Label>
            <FormItem name="license_number" className="m-0">
              <Field
                name="license_number"
                type="text"
                className={"form-control"}
                autoComplete="off"
                value={values.license_number}
                onChange={(e) => handleChange(e)}
                placeholder="Ingrese Licencia de manejo"
              />
            </FormItem>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
          <FormGroup>
            <Label className="form-label">
              Tipo<span className="red-color">*</span>
            </Label>
            <FormItem name="type" className="m-0">
              <Select
                name="type"
                className={"form-control p-0"}
                value={values.type}
                onChange={(e) => handleChange(e)}
              >
                <Select.Option value="">Seleccionar tipo</Select.Option>
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
      </Row>
    </>
  );
};

export default FigureForm;
