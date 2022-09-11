import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Spin, Radio, DatePicker } from "antd";
import { Formik, Field, Form } from "formik";
import { useSelector } from "react-redux";
import { FormGroup, Col, Row, Label, Spinner } from "reactstrap";
import {
  getCouponById,
  updateCouponById,
  createCoupon,
} from "../../../requests/coupon";
import FeatherIcon from "feather-icons-react";
import { LoadingOutlined } from "@ant-design/icons";
import alertContainer from "../../../utils/Alert";
import schema from "./schema";
import moment from "moment";
import { Select } from "formik-antd";

const COUPON_DURATIONS = [
  { label: "Unico", value: "once" },
  { label: "Repetitivo", value: "repeating" },
  { label: "Siempre", value: "forever" },
];

const COUPON_CURRENCIES = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "MXN", value: "mxn" },
];

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

function CouponModal(props) {
  const { visible, handleCancel, handleOk, selectedCoupon } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [discountType, setDiscountType] = useState("amount");

  const [data, setData] = useState({
    name: "",
    currency: "mxn",
    amount_off: 0,
    percent_off: null,
    duration: "once",
    duration_in_months: null,
    redeem_by: null,
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (selectedCoupon) {
      getOneCoupon(selectedCoupon.id);
    }
  }, [currentUser]);

  const getOneCoupon = (id) => {
    setSpinner(true);
    getCouponById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          let resp = response.data.data;
          setData({
            ...data,
            id: resp.id,
            ...resp.attributes,
          });
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleSubmit = (values) => {
    setBtnSpinner(true);
    showError("");

    let submitRequest = null;
    if (selectedCoupon) {
      submitRequest = updateCouponById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        values,
        selectedCoupon.id
      );
    } else {
      submitRequest = createCoupon(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        values
      );
    }

    if (!submitRequest) return false;

    submitRequest.then(
      (response) => {
        setBtnSpinner(false);
        if ([200, 201].includes(response.status) && response.data.message) {
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
          error?.response?.data?.errors || ["Failed to save coupon!"]
        );
      }
    );
  };

  const isEdit = useMemo(() => {
    return selectedCoupon;
  }, [selectedCoupon]);

  return (
    <Modal
      className="entityModalContainer"
      title={isEdit ? "Actualizar Cupon" : "Crear Cupon"}
      visible={visible}
      onOk={handleOk}
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
          validationSchema={schema}
          onSubmit={handleSubmit}
          render={({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleSubmit,
          }) => (
            <Form>
              <>
                <Row className="ant-row mb-3">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Nombre</Label>
                      <div className="d-flex">
                        <Field
                          name="name"
                          type="text"
                          value={values.name}
                          className={"form-control"}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <div className="invalid-feedback d-block">
                          {errors.name}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Duracion</Label>
                      <div className="d-flex">
                        <Select
                          name="duration"
                          className={
                            "form-control p-0" +
                            (errors.duration && touched.duration
                              ? " is-invalid"
                              : "")
                          }
                          value={values.duration}
                          onChange={(e) => {
                            handleChange(e);
                            if (e.target.value !== "repeating") {
                              setFieldValue("duration_in_months", null);
                            }
                          }}
                          disabled={isEdit}
                        >
                          {COUPON_DURATIONS.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.value}>
                                {item.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </div>
                      {errors.duration && touched.duration && (
                        <div className="invalid-feedback d-block">
                          {errors.duration}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  {values.duration === "repeating" && (
                    <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                      <FormGroup>
                        <Label className="form-label">Meses de duracion</Label>
                        <div className="d-flex">
                          <Field
                            name="duration_in_months"
                            type="number"
                            value={values.duration_in_months}
                            className={"form-control"}
                          />
                        </div>
                        {errors.duration_in_months &&
                          touched.duration_in_months && (
                            <div className="invalid-feedback d-block">
                              {errors.duration_in_months}
                            </div>
                          )}
                      </FormGroup>
                    </div>
                  )}
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <Label className="form-label">Tipo Descuento</Label>
                    <div className="d-flex">
                      <Radio.Group
                        value={discountType}
                        onChange={(e) => {
                          setDiscountType(e.target.value);
                          if (e.target.value === "amount") {
                            setFieldValue("percent_off", null);
                          } else {
                            setFieldValue("amount_off", null);
                          }
                        }}
                        disabled={isEdit}
                      >
                        <Radio value="amount">Cantidad</Radio>
                        <Radio value="percent">Porcentaje</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                  {discountType === "amount" ? (
                    <>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                        <FormGroup>
                          <Label className="form-label">Total</Label>
                          <div className="d-flex">
                            <Field
                              name="amount_off"
                              type="number"
                              value={values.amount_off}
                              className={"form-control"}
                              disabled={isEdit}
                            />
                          </div>
                          {errors.amount_off && touched.amount_off && (
                            <div className="invalid-feedback d-block">
                              {errors.amount_off}
                            </div>
                          )}
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                        <FormGroup>
                          <Label className="form-label">Moneda</Label>
                          <div className="d-flex">
                            <Select
                              name="currency"
                              className={"form-control p-0"}
                              value={values.currency}
                              disabled={isEdit}
                              onChange={handleChange}
                            >
                              {COUPON_CURRENCIES.map((item, index) => {
                                return (
                                  <Select.Option key={index} value={item.value}>
                                    {item.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </div>
                          {errors.currency && touched.currency && (
                            <div className="invalid-feedback d-block">
                              {errors.currency}
                            </div>
                          )}
                        </FormGroup>
                      </div>
                    </>
                  ) : (
                    <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                      <FormGroup>
                        <Label className="form-label">Total %</Label>
                        <div className="d-flex">
                          <Field
                            name="percent_off"
                            type="number"
                            value={values.percent_off}
                            className={"form-control"}
                            disabled={isEdit}
                          />
                        </div>
                        {errors.percent_off && touched.percent_off && (
                          <div className="invalid-feedback d-block">
                            {errors.percent_off}
                          </div>
                        )}
                      </FormGroup>
                    </div>
                  )}
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <Label className="form-label">Expiracion</Label>
                    <div className="d-flex">
                      <DatePicker
                        placeholder="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        value={
                          values.redeem_by
                            ? moment(values.redeem_by, "YYYY-MM-DD")
                            : null
                        }
                        className={
                          "form-control" +
                          (errors.redeem_by && touched.redeem_by
                            ? " is-invalid"
                            : "")
                        }
                        onChange={(date, dateString) =>
                          setFieldValue("redeem_by", dateString)
                        }
                        disabled={isEdit}
                      />
                    </div>
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
                        <Button
                          className="entityBtn"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          {isEdit ? "Actualizar" : "Crear"}
                        </Button>
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

export default CouponModal;
