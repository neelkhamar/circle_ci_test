import React from "react";
import * as Yup from "yup";
import Link from "next/link";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormGroup, Col, Row, Label } from "reactstrap";
import { signIn } from "../../requests/authentication";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "reactstrap";
import { setCurrentUser } from "../../redux/user/Action";
import actions from "../../redux/notification/actions";

import { alertContainer } from "../../utils/Alert";

const SignIn = ({ spinner, setSpinner }) => {
  const { readNotificationSuccess } = actions;

  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().required(
          "El email es requerido para poder crear la cuenta"
        ),
        password: Yup.string().required(
          "La contraseña es requerida para poder crear la cuenta"
        ),
      })}
      onSubmit={({ email, password }, { setStatus, setSubmitting }) => {
        setStatus();
        setSpinner(true);
        signIn(email, password).then(
          (response) => {
            const data = response.data.data;
            const token = response.data.token;
            const results = [];
            setSpinner(false);
            alertContainer({
              title: "Exito!",
              text: response.data.message,
              icon: "success",
              showConfirmButton: false,
            });
            if (response.data.notifications.length) {
              results = response.data.notifications.map((row, index) => {
                let obj = {};
                obj["from"] = row.body;
                obj["resource_type"] = row.resource_type;
                obj["distance_of_time_in_words"] =
                  row.distance_of_time_in_words || "";
                obj["mark_as_read"] = row.mark_as_read;
                obj["id"] = row.id;
                return obj;
              });
            }
            dispatch(readNotificationSuccess(results));
            dispatch(
              setCurrentUser({
                uid: data.uid,
                roles: response.data.roles,
                client: token.client,
                accessToken: token.token,
                userDetails: JSON.stringify(data),
                certsValidated: response.data.ready,
              })
            );
            Router.push("/home");
          },
          (error) => {
            const data = error?.response?.data || {
              errors: "Algo salió mal. Por favor, inténtelo de nuevo más tarde",
            };
            setStatus(data.errors);
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
                {"Iniciar Sesion"}
                <span></span>
              </button>
            </Col>
          </Row>
          <Row className="forgot-password">
            <Link href="#">
              <a>Olvidaste la contraseña?</a>
            </Link>
          </Row>
          {status &&
            (Array.isArray(status) === true ? (
              status.map((error, index) => (
                <div key={index} className={"alert alert-danger"}>
                  {error}
                </div>
              ))
            ) : (
              <div className={"alert alert-danger"}>{status}</div>
            ))}
        </Form>
      )}
    />
  );
};

export default SignIn;
