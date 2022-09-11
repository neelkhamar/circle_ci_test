import React from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormGroup, Col, Row, Label } from "reactstrap";
import { signUp } from "../../requests/authentication";

import { useDispatch } from "react-redux";
import { Spinner } from "reactstrap";
import { setCurrentUser } from "../../redux/user/Action";
import Router from "next/router";
import { alertContainer } from "../../utils/Alert";

const SignUp = ({ spinner, setSpinner }) => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().required(
          "El email es requerido para poder crear la cuenta"
        ),
        password: Yup.string().required(
          "La contraseña es requerida para poder crear la cuenta"
        ),
        passwordConfirmation: Yup.string().required(
          "La confirmacion de la contraseña es requerida para poder crear la cuenta"
        ),
      })}
      onSubmit={(
        { email, password, passwordConfirmation },
        { setStatus, setSubmitting }
      ) => {
        setStatus();
        setSpinner(true);

        signUp(email, password, passwordConfirmation).then(
          (response) => {
            const data = response.data.data;
            setSpinner(false);
            alertContainer({
              title: "Exito!",
              text: response.data.message,
              icon: "success",
              showConfirmButton: false,
            });
            dispatch(setCurrentUser({ uid: data.uid }));
            Router.push("/login");
          },
          (error) => {
            const data = error.response.data;
            setStatus(data.errors.full_messages);
            setSpinner(false);
          }
        );
      }}
      render={({ errors, status, touched }) => (
        <Form>
          <>
            <FormGroup>
              <Label className="form-label">Correo Electronico</Label>
              <Field
                name="email"
                type="text"
                className={
                  "form-control" +
                  (errors.email && touched.email ? " is-invalid" : "")
                }
                placeholder="Correo Electronico"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="invalid-feedback"
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label">Contraseña</Label>
              <Field
                name="password"
                type="password"
                className={
                  "form-control" +
                  (errors.password && touched.password ? " is-invalid" : "")
                }
                placeholder="Contraseña"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="invalid-feedback"
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label">Confirmar Contraseña</Label>
              <Field
                name="passwordConfirmation"
                type="password"
                className={
                  "form-control" +
                  (errors.passwordConfirmation && touched.passwordConfirmation
                    ? " is-invalid"
                    : "")
                }
                placeholder="Confirmar contraseña"
              />
              <ErrorMessage
                name="passwordConfirmation"
                component="div"
                className="invalid-feedback"
              />
            </FormGroup>
          </>
          <Row className="my-3">
            <Col xs="12">
              <button type="submit" className="default-btn" disabled={spinner}>
                {spinner ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  ></Spinner>
                ) : (
                  <i className="bx bx-log-in"></i>
                )}
                {"Registrarse"}
                <span></span>
              </button>
            </Col>
          </Row>
          {status &&
            (Array.isArray(status) === true ? (
              status.map((error) => (
                <div className={"alert alert-danger"}>{error}</div>
              ))
            ) : (
              <div className={"alert alert-danger"}>{status}</div>
            ))}
        </Form>
      )}
    />
  );
};

export default SignUp;
