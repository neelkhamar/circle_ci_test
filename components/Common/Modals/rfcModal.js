import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem } from "formik-antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import { setCurrentUser } from "../../../redux/user/Action";
import { fetchSessionValue, rfcValidate } from "../../../requests/company";
import alertContainer from "../../../utils/Alert";

function RFCModal(props) {
  const router = useRouter();
  const { visible, handleOk } = props;
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errorList, setErrorList] = useState(null);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const navigateDashboard = () => {
    router.push("/home/");
  };

  const validateRFC = (value) => {
    let error;
    if (value && !/^[A-Z]{3,4}[0-9]{6}[0-9A-Z]{3}$/i.test(value)) {
      error = "Introduzca un RFC válido";
    }
    return error;
  };

  const saveForm = (values) => {
    let payload = {
      rfc: values.rfc,
      password: values.password,
    };
    setBtnSpinner(true);
    setErrorList(null);
    rfcValidate(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      payload
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 200) {
          handleOk();
        }
      },
      (error) => {
        setBtnSpinner(false);
        setErrorList(error.response.data.errors);
      }
    );
  };

  const fetchSessionKey = (values) => {
    let payload = {
      rfc: values.rfc,
      password: values.password,
    };
    setBtnSpinner(true);
    setErrorList(null);
    fetchSessionValue(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      payload
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 200) {
          handleOk();
        }
      },
      (error) => {
        setBtnSpinner(false);
        setErrorList(error.response.data.errors);
      }
    );
  };

  return (
    <Modal
      className="entityModalContainer"
      title={"Sat Authentication"}
      visible={visible}
      onOk={handleOk}
      closable={false}
      footer={[]}
    >
      {spinner ? (
        <div className="text-center">
          <LoadingOutlined style={{ fontSize: 40, color: "blue" }} spin />
        </div>
      ) : (
        <Formik
          initialValues={{ rfc: "", password: "" }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            rfc: Yup.string().required("Se requiere la RFC"),
            password: Yup.string().required("Se requiere contraseña"),
          })}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus();
            if (props.cfdi) {
              fetchSessionKey(values);
            } else {
              saveForm(values);
            }
          }}
          render={({ values, handleChange, handleBlur }) => (
            <Form>
              <>
                <Row className="ant-row">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <div>
                        <Label className="form-label">
                          RFC<span className="red-color">*</span>
                        </Label>
                        <FormItem name="rfc">
                          <Field
                            name="rfc"
                            type="text"
                            validate={validateRFC}
                            autoComplete="off"
                            className={"form-control"}
                            placeholder="RFC"
                            value={values.rfc}
                            onChange={handleChange}
                          />
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <div>
                        <Label className="form-label">
                          Password<span className="red-color">*</span>
                        </Label>
                        <FormItem name="password">
                          <Field
                            name="password"
                            type="password"
                            autoComplete="off"
                            className={"form-control"}
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                          />
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                </Row>
                {errorList &&
                typeof errorList === "array" &&
                errorList.length > 0 ? (
                  <Row>
                    {errorList.map((item, index) => {
                      return (
                        <Col md={24} key={index}>
                          <div className={"alert alert-danger m-0 mt-2"}>
                            {item}
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                ) : errorList &&
                  typeof errorList === "object" &&
                  errorList.message ? (
                  <Row>
                    <Col md={24}>
                      <div className={"alert alert-danger m-0 mt-2"}>
                        {errorList.message}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                <Row className={"mb-2 mt-2"}>
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
                          value="Salvar"
                        />
                      )}
                      {props.cfdi ? (
                        <Button
                          className="entityBtnWhite"
                          onClick={props.handleCancel}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          className="entityBtnWhite"
                          onClick={navigateDashboard}
                        >
                          Go to Dashboard
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

export default RFCModal;
