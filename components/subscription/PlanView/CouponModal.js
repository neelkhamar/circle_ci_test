import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem } from "formik-antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { verifyCoupon } from "../../../requests/subscription";

const CouponForm = ({ afterSubmit, continueSpinner }) => {
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [data, setData] = useState({
    code: "",
  });
  const [error, setError] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coupon, setCoupon] = useState(null);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const submitHandler = (values, isApply) => {
    setError(false);
    showError("");
    if (isApply) {
      if (values.code) {
        setBtnSpinner(true);
        verifyCoupon(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          values.code
        ).then(
          (response) => {
            setBtnSpinner(false);
            if (response.status === 200 && response.data.valid) {
              setApplied(true);
              setCoupon(response.data.coupon);
            } else {
              setApplied(false);
              showError("Invalid coupon code!");
            }
          },
          (error) => {
            setBtnSpinner(false);
          }
        );
      } else {
        setError(true);
      }
    } else {
      afterSubmit(applied ? coupon : {});
    }
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      onSubmit={() => {}}
      render={({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form>
          <>
            <Row className="ant-row">
              <div className="ant-col-md-24 ant-col-xs-24">
                <FormGroup>
                  <Label className="form-label">
                    <b>Tienes algun cupon de descuento?</b>
                  </Label>
                  <FormItem name="code" className="mb-0">
                    <Field
                      name="code"
                      type="text"
                      disabled={applied}
                      className={"form-control"}
                      placeholder="Escribir codigo del cupon"
                      value={values.code}
                      onChange={handleChange}
                    />
                  </FormItem>
                </FormGroup>
              </div>
              {!applied && error ? (
                <div className="ant-col-md-24 ant-col-xs-24">
                  <small className="color-error">
                    Codigo del cupon es requerido
                  </small>
                </div>
              ) : null}
              {applied && (
                <div className="ant-col-md-24 ant-col-xs-24">
                  <small className="greenColor">Cupon valido!</small>
                </div>
              )}
            </Row>
            {errorAlert ? (
              <Row className="mt-2">
                <Col md={24}>
                  <div className={"alert alert-danger m-0"}>{errorAlert}</div>
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <Row className="mt-3">
              <Col md={12}>
                <FormGroup className="d-flex">
                  {!applied ? (
                    <>
                      {btnSpinner ? (
                        <Button className="couponBtn" disabled={true}>
                          <LoadingOutlined
                            style={{ fontSize: 18, color: "white" }}
                            spin
                          />
                        </Button>
                      ) : (
                        <input
                          key="back1"
                          className="couponBtn"
                          disabled={continueSpinner}
                          type="submit"
                          onClick={() => submitHandler(values, true)}
                          value={"Canjear"}
                        />
                      )}
                    </>
                  ) : null}
                  {continueSpinner ? (
                    <Button className="couponBtn" disabled={true}>
                      <LoadingOutlined
                        style={{ fontSize: 18, color: "white" }}
                        spin
                      />
                    </Button>
                  ) : (
                    <input
                      key="back"
                      className="couponBtn"
                      type="submit"
                      disabled={btnSpinner}
                      onClick={() => submitHandler(values, false)}
                      value={applied ? "Continuar" : "No tengo cupon"}
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

function CouponModal(props) {
  const { visible, handleCancel, handleOk, continueSpinner } = props;

  return (
    <Modal
      title={"Canjear Cupon"}
      className="coupon-modal-container"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      <CouponForm afterSubmit={handleOk} continueSpinner={continueSpinner} />
    </Modal>
  );
}

export default CouponModal;
