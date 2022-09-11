import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import {
  createPaymentCard,
  updatePaymentCardById,
} from "../../../../requests/payment-methods";
import alertContainer from "../../../../utils/Alert";
import schema from "./schema";

const PaymentCardForm = ({ card, afterSubmit }) => {
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);

  const [data, setData] = useState({
    name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    defaultSource: false,
  });

  useEffect(() => {
    if (card) {
      setData({
        ...data,
        name: card.name,
        address_line1: card.address_line1,
        address_line2: card.address_line2,
        city: card.address_city,
        state: card.address_state,
        country: card.address_country,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        stripe_id: card.stripe_card_id,
        defaultSource: card.default_source,
      });
    }
  }, [card]);

  const isEdit = useMemo(() => {
    return card && card.id;
  }, [card]);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (values) => {
    let submitRequest = null;

    if (isEdit) {
      let payload = {
        card: {
          name: values.name,
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          address_city: values.city,
          address_state: values.state,
          address_country: values.country,
          default_source: values.defaultSource,
        },
      };
      submitRequest = updatePaymentCardById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload,
        card.id
      );
    } else {
      if (elements == null) {
        return;
      }
      const { error, token } = await stripe.createToken(
        elements.getElement(CardElement),
        values
      );
      if (error) {
        setErrorList(["Failed to create payment method!"]);
        return;
      }

      let payload = {
        card: {
          name: values.name,
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          address_city: values.city,
          address_state: values.state,
          address_country: values.country,
        },
        token: token.id,
      };
      console.log(values, token);
      submitRequest = createPaymentCard(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      );
    }

    if (!submitRequest) return false;

    setBtnSpinner(true);
    showError("");
    submitRequest.then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 200 && response.data.message) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          afterSubmit();
        }
      },
      (error) => {
        setBtnSpinner(false);
        setErrorList(
          error?.response?.data?.errors || ["Failed to create payment method!"]
        );
      }
    );
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      validationSchema={schema}
      onSubmit={handleSubmit}
      render={({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form>
          <>
            <Row className="ant-row mb-3">
              {!isEdit && (
                <div className="ant-col-24">
                  <FormGroup>
                    <Label className="form-label">
                      Numero de Tarjeta<span className="red-color">*</span>
                    </Label>
                    <div className="form-control">
                      <CardElement
                        id="card-payment"
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              lineHeight: "1.5",
                            },
                          },
                        }}
                      />
                    </div>
                  </FormGroup>
                </div>
              )}
              <div className="ant-col-md-12 ant-col-xs-24 mt-3">
                <FormGroup>
                  <Label className="form-label">Nombre Completo</Label>
                  <div className="d-flex">
                    <Field
                      name="name"
                      className={`form-control ${
                        errors.name && touched.name ? " is-invalid" : ""
                      }`}
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <div className="invalid-feedback d-block">
                      {errors.name}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col-md-12 ant-col-xs-24 mt-3">
                <FormGroup>
                  <Label className="form-label">Direccion</Label>
                  <div className="d-flex">
                    <Field
                      name="address_line1"
                      className={`form-control ${
                        errors.address_line1 && touched.address_line1
                          ? " is-invalid"
                          : ""
                      }`}
                      type="text"
                      value={values.address_line1}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.address_line1 && touched.address_line1 && (
                    <div className="invalid-feedback d-block">
                      {errors.address_line1}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col-md-12 ant-col-xs-24 mt-3">
                <FormGroup>
                  <Label className="form-label">Direccion 2</Label>
                  <div className="d-flex">
                    <Field
                      name="address_line2"
                      className={`form-control ${
                        errors.address_line2 && touched.address_line2
                          ? " is-invalid"
                          : ""
                      }`}
                      type="text"
                      value={values.address_line2}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.address_line2 && touched.address_line2 && (
                    <div className="invalid-feedback d-block">
                      {errors.address_line2}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col-md-12 ant-col-xs-24 mt-3">
                <FormGroup>
                  <Label className="form-label">Ciudad</Label>
                  <div className="d-flex">
                    <Field
                      name="city"
                      className={`form-control ${
                        errors.city && touched.city ? " is-invalid" : ""
                      }`}
                      type="text"
                      value={values.city}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.city && touched.city && (
                    <div className="invalid-feedback d-block">
                      {errors.city}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col-md-12 ant-col-xs-24 mt-3">
                <FormGroup>
                  <Label className="form-label">Estado</Label>
                  <div className="d-flex">
                    <Field
                      name="state"
                      className={`form-control ${
                        errors.state && touched.state ? " is-invalid" : ""
                      }`}
                      type="text"
                      value={values.state}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.state && touched.state && (
                    <div className="invalid-feedback d-block">
                      {errors.state}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col-md-12 ant-col-xs-24 mt-3">
                <FormGroup>
                  <Label className="form-label">Pais</Label>
                  <div className="d-flex">
                    <Field
                      name="country"
                      className={`form-control ${
                        errors.country && touched.country ? " is-invalid" : ""
                      }`}
                      type="text"
                      value={values.country}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.country && touched.country && (
                    <div className="invalid-feedback d-block">
                      {errors.country}
                    </div>
                  )}
                </FormGroup>
              </div>
              {isEdit && !card.default_source && (
                <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                  <FormGroup>
                    <div>
                      <label className="pb-3">
                        <Field
                          type="checkbox"
                          name="defaultSource"
                          className="mr-3"
                          checked={values.defaultSource}
                          onChange={handleChange}
                        />
                        <b>Seleccionar esta tarjeta como primaria</b>
                      </label>
                    </div>
                  </FormGroup>
                </div>
              )}
            </Row>
            {errorAlert ? (
              <Row>
                <Col md={24}>
                  <div className={"alert alert-danger m-0"}>{errorAlert}</div>
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
                      value={"Guardar"}
                    />
                  )}
                </FormGroup>
              </Col>
            </Row>
          </>
        </Form>
      )}
    />
  );
};

function CardModal(props) {
  const { visible, handleCancel, handleOk, selectedCard } = props;

  const stripePromise = loadStripe(
    "pk_test_51KJMpnKQLLaCS2hK7fwpmtD2izh1w25jvXAQCdpAhpVuvo0CxVkT2mOb2GnQuKevx1qrgA3Nzvgf84HLAh2Uu1w70046HJhDSA"
  );

  return (
    <Modal
      className="entityModalContainer"
      title={selectedCard ? "Actualizar tarjeta" : "Agregar tarjeta"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      <Elements stripe={stripePromise}>
        <PaymentCardForm card={selectedCard} afterSubmit={handleOk} />
      </Elements>
    </Modal>
  );
}

export default CardModal;
