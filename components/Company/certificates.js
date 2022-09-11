import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Spin, Upload } from "antd";
import { Button } from "../buttons/buttons";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormItem, Select } from "formik-antd";
import alertContainer from "../../utils/Alert";
import {
  getCompanyDetailById,
  updateCompanyDetails,
  uploadCertificates,
} from "../../requests/company";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { CloseOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/user/Action";

const { Search } = Input;
const suffix = (
  <CloseOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

function Certificate({ data, currentUser, getCompanyDetails }) {
  const dispatch = useDispatch();
  const [errorList, setErrorList] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [selected, setSelected] = useState(false);
  const [cerFile, setCerFile] = useState([]);
  const [keyFile, setKeyFile] = useState([]);
  const [showErrors, setShowErrors] = useState({
    cerError: false,
    keyError: false,
  });

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      validationSchema={() =>
        Yup.lazy((values) => {
          let validate = {
            password: Yup.string().required("Se requiere la Password"),
          };
          return Yup.object().shape(validate);
        })
      }
      onSubmit={(values, { setStatus, setSubmitting }) => {
        if (cerFile.length && keyFile.length) {
          setBtnSpinner(true);
          let payload = new FormData();
          setErrorList([]);
          payload.append("cer_file", cerFile[0].originFileObj);
          payload.append("key_file", keyFile[0].originFileObj);
          payload.append("password", values.password);
          uploadCertificates(
            currentUser.accessToken,
            currentUser.uid,
            currentUser.client,
            payload
          ).then(
            (response) => {
              setBtnSpinner(false);
              if (response.status === 201) {
                alertContainer({
                  title: response.data.message,
                  text: "",
                  icon: "success",
                  showConfirmButton: false,
                });
                setCerFile([]);
                setKeyFile([]);
                dispatch(
                  setCurrentUser({
                    ...currentUser,
                    certsValidated: true,
                  })
                );
                getCompanyDetails();
              }
            },
            (error) => {
              setBtnSpinner(false);
              setErrorList(error.response.data.errors);
            }
          );
        } else {
          let error = {
            cerFile: false,
            keyFile: false,
          };
          if (cerFile.length === 0) {
            error[cerFile] = true;
          }
          if (keyFile.length === 0) {
            error[keyFile] = true;
          }
          setShowErrors(error);
        }
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
          <>
            <Row className="ant-row card_container">
              <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                <span className="ant-page-header-heading-title">
                  Información
                </span>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3 uploaded-item">
                <FormGroup>
                  <Label className="form-label">
                    Certificado .cer<span className="red-color">*</span>
                  </Label>
                  <FormItem name="cert">
                    <Upload
                      className="w-100"
                      disabled={data.certs_flag}
                      accept=".cer"
                      multiple={false}
                      maxCount={1}
                      onChange={(e) => {
                        if (e.fileList.length) {
                          setShowErrors({
                            ...errors,
                            cerError: false,
                          });
                        } else {
                          setShowErrors({
                            ...errors,
                            cerError: true,
                          });
                        }
                        setCerFile(e.fileList);
                      }}
                    >
                      <Button className="upload-cert-btn">
                        Click para subir archivo .cer
                      </Button>
                    </Upload>
                  </FormItem>
                  {showErrors.cerError ? (
                    <div className="invalid-feedback font14 d-block">
                      Archivo .cer es requerido
                    </div>
                  ) : null}
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3 uploaded-item">
                <FormGroup>
                  <Label className="form-label">
                    Certificado .key<span className="red-color">*</span>
                  </Label>
                  <FormItem name="key">
                    <Upload
                      className="w-100"
                      accept=".key"
                      disabled={data.certs_flag}
                      multiple={false}
                      maxCount={1}
                      onChange={(e) => {
                        if (e.fileList.length) {
                          setShowErrors({
                            ...showErrors,
                            keyError: false,
                          });
                        } else {
                          setShowErrors({
                            ...showErrors,
                            keyError: true,
                          });
                        }
                        setKeyFile(e.fileList);
                      }}
                    >
                      <Button className="upload-cert-btn">
                        Click para subir archivo .key
                      </Button>
                    </Upload>
                  </FormItem>
                  {showErrors.keyError ? (
                    <div className="invalid-feedback font14 d-block">
                      Archivo .key es requerido
                    </div>
                  ) : null}
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
                <FormGroup>
                  <Label className="form-label">
                    Contraseña<span className="red-color">*</span>
                  </Label>
                  <FormItem name="password">
                    <Field
                      name="password"
                      type="password"
                      disabled={data.certs_flag}
                      className={"form-control password-custom-height"}
                      placeholder="Contraseña"
                      suffix={suffix}
                      value={values.password}
                      onChange={handleChange}
                    />
                  </FormItem>
                </FormGroup>
              </div>
              {errorList.length > 0 &&
                errorList.map((err, index) => {
                  return (
                    <div
                      key={index}
                      className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2"
                    >
                      <div className={"alert alert-danger m-0 mt-3"}>
                        {typeof err === "object" ? err.message : err}
                      </div>
                    </div>
                  );
                })}
              {!data.certs_flag ? (
                <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
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
                  </FormGroup>
                </div>
              ) : (
                <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                  <small>
                    NOTA:{" "}
                    <span className="greenColor">
                      Los certificados ya fueron cargados.
                    </span>
                  </small>
                </div>
              )}
            </Row>
          </>
        </Form>
      )}
    />
  );
}

export default Certificate;
