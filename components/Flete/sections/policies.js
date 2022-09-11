import { Field } from "formik";
import React from "react";
import { FormGroup, Label, Row } from "reactstrap";

const Policies = ({ handleChange, values }) => {
  return (
    <Row className="ant-row mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
        <span className="ant-page-header-heading-title">Polizas de seguro</span>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">Aseguradora de la mercancia</Label>
          <Field
            name="insuranceName"
            placeholder="Ingrese Aseguradora de la mercancia"
            type="text"
            className={"form-control"}
            value={values.insuranceName || ""}
            onChange={handleChange}
          />
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">Poliza de seguro de la mercancia</Label>
          <Field
            name="insuranceNumber"
            placeholder="Ingrese Poliza de seguro de la mercancia"
            type="text"
            className={"form-control"}
            value={values.insuranceNumber || ""}
            onChange={handleChange}
          />
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">Aseguradora de daño ambiental</Label>
          <Field
            name="environmentDamage"
            placeholder="Ingrese Aseguradora de dano ambiental"
            type="text"
            className={"form-control"}
            value={values.environmentDamage || ""}
            onChange={handleChange}
          />
        </FormGroup>
      </div>
      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
        <FormGroup>
          <Label className="form-label">
            Poliza de seguro por daño ambiental
          </Label>
          <Field
            name="insuranceEnvironment"
            placeholder="Ingrese Poliza de seguro por dano ambiental"
            type="text"
            className={"form-control"}
            value={values.insuranceEnvironment || ""}
            onChange={handleChange}
          />
        </FormGroup>
      </div>
    </Row>
  );
};

export default React.memo(Policies);
