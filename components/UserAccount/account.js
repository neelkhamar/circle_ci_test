import { Alert } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem } from "formik-antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import { setCurrentUser } from "../../redux/user/Action";
import { getUserProfile, updateUserAccount } from "../../requests/profile";
import alertContainer from "../../utils/Alert";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import Heading from "../heading/heading";
import { AccountWrapper } from "./styled";

const Account = () => {
  const dispatch = useDispatch();

  let currentUser = useSelector((state) => {
    return state.auth.currentUser;
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [accountData, setAccountData] = useState({ email: "" });
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [passwordBtnSpinner, setPasswordBtnSpinner] = useState(false);

  const fetchProfile = () => {
    if (currentUser.userDetails) {
      let user = JSON.parse(currentUser.userDetails);
      setAccountData({ email: user.email });
    } else {
      fetchProfileDetails();
    }
  };

  const fetchProfileDetails = () => {
    getUserProfile(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then((response) => {
      if (response.status === 200) {
        let output = response.data.data;
        setAccountData({
          email: output.email,
        });
      }
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchProfile();
    }

    return () => (mounted = false);
  }, []);

  const handleSubmit = (values) => {
    setBtnSpinner(true);
    updateUserAccount(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      values
    ).then(
      (response) => {
        if (response.status === 200) {
          const data = response.data.data;
          const token = response.data.token;
          const message = response.data.message;
          alertContainer({
            title: message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          dispatch(
            setCurrentUser({
              uid: data.uid,
              client: token.client,
              accessToken: token.token,
            })
          );
          currentUser = {
            uid: data.uid,
            client: token.client,
            accessToken: token.token,
          };
          fetchProfileDetails();
        } else {
          console.log(response.data.errors);
        }
        setBtnSpinner(false);
      },
      (error) => {
        setErrorMessage(error.response.data.errors.full_messages);
        setBtnSpinner(false);
      }
    );
  };

  const validateEmail = (value) => {
    let error;
    if (
      value &&
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        value
      )
    ) {
      error = "Introduzca un correo electrónico válido";
    }
    return error;
  };

  const handlePasswordChange = (values) => {
    setPasswordBtnSpinner(true);
    updateUserPassword(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      values
    ).then(
      (response) => {
        setPasswordBtnSpinner(false);
        if (response.status === 200) {
          alertContainer({
            title: "Password Updated Successfully!",
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          setPasswordData({
            old_password: "",
            new_password: "",
          });
        }
      },
      (error) => {
        setErrorMessagePassword(error.response.data.errors.full_messages);
        setPasswordBtnSpinner(false)(false);
      }
    );
  };

  return (
    <AccountWrapper>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Configuracion de la Cuenta</Heading>
          </div>
        }
      >
        <Row gutter={25}>
          <Col xs={24}>
            {/* <BasicFormWrapper> */}
            {/* <Form form={form} name="editAccount" initialValues={accountData} onFinish={handleSubmit}> */}
            <div>
              <Formik
                initialValues={accountData}
                enableReinitialize={true}
                validationSchema={() =>
                  Yup.lazy(() => {
                    let validate = {
                      email: Yup.string().required(
                        "Se requiere la Email Address"
                      ),
                    };
                    return Yup.object().shape(validate);
                  })
                }
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  handleSubmit(values);
                }}
                render={({
                  values,
                  errors,
                  status,
                  touched,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                }) => (
                  <Form>
                    <Row className="ant-row">
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Correo Electronico
                              <span className="red-color">*</span>
                            </Label>
                            <FormItem name="email" className="m-0">
                              <Field
                                name="email"
                                type="text"
                                className={"form-control"}
                                validate={validateEmail}
                                value={values.email}
                                onChange={handleChange}
                                placeholder="Correo Electronico"
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                        {errorMessage ? (
                          <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                            <Alert
                              message=""
                              description={errorMessage}
                              type="error"
                              className="mb-2"
                              closable
                              onClose={() => {
                                setErrorMessage("");
                              }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                        {btnSpinner ? (
                          <Button
                            className="entityBtnDuplicate"
                            disabled={true}
                          >
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
                            className={`entityBtn`}
                            disabled={!values.email}
                            type="submit"
                            value={"Guardar"}
                          />
                        )}
                      </div>
                    </Row>
                  </Form>
                )}
              />
            </div>
          </Col>
        </Row>
      </Cards>

      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Contraseña</Heading>
          </div>
        }
      >
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <Formik
                initialValues={passwordData}
                enableReinitialize={true}
                validationSchema={() =>
                  Yup.lazy(() => {
                    let validate = {
                      old_password: Yup.string().required(
                        "Se requiere la Contraseña actual"
                      ),
                      new_password: Yup.string()
                        .required("Se requiere la Contraseña nueva")
                        .min(6, "Too Short!"),
                    };
                    return Yup.object().shape(validate);
                  })
                }
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  handlePasswordChange(values);
                }}
                render={({ handleChange, values }) => (
                  <Form>
                    <Row className="ant-row">
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Contraseña actual
                              <span className="red-color">*</span>
                            </Label>
                            <FormItem name="old_password">
                              <Field
                                name="old_password"
                                type="password"
                                className={"form-control"}
                                placeholder="Contraseña actual"
                                value={values.old_password}
                                onChange={handleChange}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                        <FormGroup>
                          <div>
                            <Label className="form-label">
                              Contraseña nueva
                              <span className="red-color">*</span>
                            </Label>
                            <FormItem name="new_password">
                              <Field
                                name="new_password"
                                type="password"
                                // validate={validateEmail}
                                className={"form-control"}
                                placeholder="Contraseña nueva"
                                value={values.new_password}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                              />
                            </FormItem>
                          </div>
                        </FormGroup>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                        <small>Minimo 6 caracteres</small>
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                        {errorMessagePassword ? (
                          <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                            <Alert
                              message=""
                              description={errorMessagePassword}
                              type="error"
                              className="mb-2"
                              closable
                              onClose={() => {
                                setErrorMessagePassword("");
                              }}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                        {passwordBtnSpinner ? (
                          <Button
                            className="entityBtnDuplicate"
                            disabled={true}
                          >
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
                            className={`entityBtn`}
                            type="submit"
                            value={"Guardar"}
                          />
                        )}
                      </div>
                    </Row>
                  </Form>
                )}
              />
            </div>
          </Col>
        </Row>
      </Cards>
    </AccountWrapper>
  );
};

export default Account;
