import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import { getPlans } from "../../../requests/plan";
import alertContainer from "../../../utils/Alert";
import {
  createPrice,
  getPriceById,
  updatePrice,
} from "..//../../requests/price";

const PLAN_CURRENCIES = [
  { label: "MXN", value: "mxn" },
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
];

function PriceModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const { visible, handleCancel, handleOk, selectedPrice } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [plans, setPlans] = useState([]);
  const [btnValue, setBtnValue] = useState("Crear");

  const [data, setData] = useState({
    plan: "",
    name: "",
    unitAmount: "",
    currency: "mxn",
    kind: "",
    action: "",
    active: true,
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchPlans();
      if (selectedPrice) {
        getPrice(selectedPrice);
      }
    }

    return () => (mounted = false);
  }, []);

  const getPrice = (id) => {
    setSpinner(true);
    getPriceById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          let result = response.data.data;
          setData({
            plan: result.attributes.plan.id,
            name: result.attributes.name,
            unitAmount: result.attributes.unit_amount,
            currency: result.attributes.currency,
            kind: result.attributes.kind,
            active: result.attributes.active,
            action: result.attributes.action || "",
          });
          setBtnValue("Actualizar");
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const fetchPlans = () => {
    setSpinner(true);
    getPlans(currentUser.accessToken, currentUser.uid, currentUser.client).then(
      (response) => {
        setSpinner(false);
        setPlans(response.data.data);
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  return (
    <Modal
      className="entityModalContainer"
      title="Nuevo Precio"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
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
            plan: Yup.string().required("Se requiere el Plan"),
            name: Yup.string().required("Se requiere el Nombre"),
            unitAmount: Yup.string().required("Se requiere el Precio"),
            currency: Yup.string().required("Se requiere La moneda"),
            kind: Yup.string().required("Se requiere el tipo"),
            action: Yup.string().required("Se requiere la accion"),
            active: Yup.string().required("Se requiere activo"),
          })}
          onSubmit={(
            { plan, name, unitAmount, currency, active, kind, action },
            { setStatus, setSubmitting }
          ) => {
            setStatus();
            setBtnSpinner(true);
            let payload = {
              price: {
                plan_id: plan,
                name: name,
                unit_amount: unitAmount,
                currency: currency,
                kind: kind,
                action: action,
                active: active,
              },
            };
            showError("");
            if (selectedPrice) {
              updatePrice(
                currentUser.accessToken,
                currentUser.uid,
                currentUser.client,
                payload,
                selectedPrice
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
                  setErrorList(error.response.data.errors);
                }
              );
            } else {
              createPrice(
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
                    error?.response?.data?.errors || [
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
          }) => (
            <Form>
              <>
                <Row className="ant-row mb-3">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                    <FormGroup>
                      <Label className="form-label">
                        Plan<span className="red-color">*</span>
                      </Label>
                      <FormItem name="plan">
                        <Select
                          name="plan"
                          className={"form-control p-0"}
                          value={values.plan}
                          onChange={handleChange}
                        >
                          <Select.Option value="">
                            Seleccionar Plan
                          </Select.Option>
                          {plans.map((item, index) => {
                            return (
                              <Select.Option
                                key={index}
                                value={item.attributes.id}
                              >
                                {item.attributes.name}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <Label className="form-label">
                        Nombre<span className="red-color">*</span>
                      </Label>
                      <div className="d-flex">
                        <Field
                          name="name"
                          type="text"
                          value={values.name}
                          onChange={handleChange}
                          className={
                            "form-control" +
                            (errors.name && touched.name ? " is-invalid" : "")
                          }
                          placeholder="Ingrese el nombre"
                        />
                      </div>
                      {errors.name && touched.name && (
                        <div className="invalid-feedback d-block">
                          {errors.name}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <Label className="form-label">
                        Precio<span className="red-color">*</span>
                      </Label>
                      <div className="d-flex">
                        <Field
                          name="unitAmount"
                          type="text"
                          value={values.unitAmount}
                          onChange={handleChange}
                          className={
                            "form-control" +
                            (errors.unitAmount && touched.unitAmount
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="Ingrese la cantidad"
                          disabled={selectedPrice}
                        />
                      </div>
                      {errors.unitAmount && touched.unitAmount && (
                        <div className="invalid-feedback d-block">
                          {errors.unitAmount}
                        </div>
                      )}
                    </FormGroup>
                  </div>

                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Tipo<span className="red-color">*</span>
                      </Label>
                      <div className="d-flex">
                        <Field
                          name="kind"
                          type="text"
                          value={values.kind}
                          onChange={handleChange}
                          className={
                            "form-control" +
                            (errors.kind && touched.kind ? " is-invalid" : "")
                          }
                          placeholder="Ingrese nombre del controlador"
                        />
                      </div>
                      {errors.kind && touched.kind && (
                        <div className="invalid-feedback d-block">
                          {errors.kind}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Accion<span className="red-color">*</span>
                      </Label>
                      <div className="d-flex">
                        <Field
                          name="action"
                          type="text"
                          value={values.action}
                          onChange={handleChange}
                          className={
                            "form-control" +
                            (errors.action && touched.action
                              ? " is-invalid"
                              : "")
                          }
                          placeholder="Ingrese la accion del controlador"
                        />
                      </div>
                      {errors.action && touched.action && (
                        <div className="invalid-feedback d-block">
                          {errors.action}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Moneda<span className="red-color">*</span>
                      </Label>
                      <FormItem name="currency">
                        <Select
                          name="currency"
                          className={"form-control p-0"}
                          value={values.currency}
                          onChange={handleChange}
                          disabled={selectedPrice}
                        >
                          {PLAN_CURRENCIES.map((item, index) => {
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
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                    <FormGroup>
                      <div>
                        <label className="pb-3">
                          <Field
                            type="checkbox"
                            name="active"
                            className="mr-3"
                            checked={values.active}
                            onChange={handleChange}
                          />
                          <b>Activo</b>
                        </label>
                      </div>
                    </FormGroup>
                  </div>
                </Row>
                {errorAlert ? (
                  <Row>
                    <Col md={24}>
                      <div className={"alert alert-danger m-0"}>
                        {errorAlert}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {errorList.length > 0 &&
                  errorList.map((err, index) => {
                    return (
                      <div key={index} className={"alert alert-danger"}>
                        {err}
                      </div>
                    );
                  })}
                <Row className={errorAlert ? "mt-3" : "mt-4"}>
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
                          onClick={handleSubmit}
                          value={btnValue}
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

export default PriceModal;
