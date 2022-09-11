import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Spin } from "antd";
import { Button } from "../buttons/buttons";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormItem, Select } from "formik-antd";
import alertContainer from "../../utils/Alert";
import { updateCompanyDetails } from "../../requests/company";
import { LoadingOutlined } from "@ant-design/icons";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import { GoogleMap, Marker } from "@react-google-maps/api";
import OTPModal from "../Common/Modals/otpModal";

const auth = getAuth();
const countryCode = "+52";
// const countryCode = "+91";

function Information({
  validateWebsite,
  validateEmail,
  containerStyle,
  options,
  btnSpinner,
  setBtnSpinner,
  data,
  taxOptions,
  errorList,
  setErrorList,
  currentUser,
  uploadFile,
  imageSpinner,
  isLoaded,
  originalPhone,
  setOriginalPhone,
  verified,
  setVerified,
}) {
  const [otpModal, setOtpModal] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [currentPhone, setCurrentPhone] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState();
  const [otpError, setOtpError] = useState([]);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const fileHandler = (e) => {
    uploadFile(e.target.files[0]);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      var captcha = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log(response, "response");
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // ...
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          },
        },
        auth
      );
      if (!recaptchaVerifier) {
        setRecaptchaVerifier(captcha);
      }
    }

    return () => {
      captcha.clear();
      mounted = false;
    };
  }, []);

  const submitForm = (values) => {
    setBtnSpinner(true);
    let selectedTax = null;
    let colonyName = "";
    let cityName = "";
    let stateName = "";
    taxOptions.map((item, index) => {
      if (item.catalog_tax_regime.id === values.tax_system) {
        selectedTax = item;
      }
    });
    options.city.map((item) => {
      if (item.id === values.city) {
        cityName = item.name;
      }
    });
    options.state.map((item) => {
      if (item.id === values.state) {
        stateName = item.name;
      }
    });
    options.colony.map((item) => {
      if (item.id === values.colony) {
        colonyName = item.name;
      }
    });
    let payload = {
      facturapi: {
        name: values.name,
        legal_name: values.legal_name,
        tax_system: selectedTax.catalog_tax_regime.code,
        address: {
          zip: values.postalCode,
          street: values.street,
          exterior: values.outside_number,
          interior: values.inside_number,
          neighborhood: colonyName,
          municipality: cityName,
          state: stateName,
        },
        website: values.website,
        support_email: values.supportEmail,
        phone: values.phone ? JSON.stringify(values.phone) : "",
      },
      company: {
        name: values.name,
        website: values.website,
        email: values.supportEmail,
        phone: values.phone ? JSON.stringify(values.phone) : "",
        street: values.street,
        outside_number: values.outside_number,
        inside_number: values.inside_number,
      },
    };
    updateCompanyDetails(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      data.id,
      payload
    ).then(
      (response) => {
        setBtnSpinner(false);
        if (response.status === 200) {
          setOriginalPhone(values.phone);
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
        }
      },
      (error) => {
        setBtnSpinner(false);
        setErrorList(error.response.data.errors);
      }
    );
  };

  const sendOtp = (phone, resend) => {
    setBtnSpinner(true);
    var phoneNumber = countryCode + phone;
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setBtnSpinner(false);
        setConfirmationResult(confirmationResult);
        alertContainer({
          title: "OTP send successfully.",
          text: "you receive otp on this number " + phoneNumber,
          icon: "success",
          showConfirmButton: false,
        });
        if (!resend) {
          setCurrentPhone(phone);
          setTimeout(() => {
            setOtpModal(true);
          }, 1500);
        }
      })
      .catch((error) => {
        console.log(error);
        setBtnSpinner(false);
      });
  };

  const resendOtp = () => {
    setOtpError([]);
    sendOtp(currentPhone, true);
  };

  const closeOtpModal = () => {
    setOtpModal(false);
  };

  const handlePhoneChange = (phone) => {
    if (phone.target.value && phone.target.value == originalPhone) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  };

  const validateOtp = (otp) => {
    if (otp.length == 6 && confirmationResult != null) {
      setOtpError([]);
      setOtpLoader(true);
      confirmationResult
        .confirm(otp)
        .then((result) => {
          setOtpLoader(false);
          alertContainer({
            title: "OTP verified successfully.",
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          setVerified(true);
          setOriginalPhone(currentPhone);
          closeOtpModal();
          // success
        })
        .catch((error) => {
          let err = [];
          if (!err.includes("Invalid OTP")) {
            err.push("Invalid OTP");
            setOtpError(err);
          }
          setOtpLoader(false);
        });
    } else {
      let err = [...otpError];
      if (!err.includes("OTP should be 6 digits")) {
        err.push("OTP should be 6 digits");
        setOtpError(err);
      }
    }
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      validationSchema={() =>
        Yup.lazy((values) => {
          let validate = {
            name: Yup.string()
              .required("Se requiere la Name")
              .max(100, "La Name debe tener menos de 100 caracteres"),
            street: Yup.string()
              .required("Se requiere la Calle")
              .min(3, "La Calle debe tener más de 3 caracteres")
              .max(150, "La Calle debe tener menos de 150 caracteres"),
            outside_number: Yup.string()
              .required("Se requiere la Número externo")
              .max(100, "La Número externo debe tener menos de 100 caracteres"),
            inside_number: Yup.string().max(
              100,
              "La Número interior debe tener menos de 100 caracteres"
            ),
            phone: Yup.string()
              .min(10, "Phone number should contain 10 digits")
              .max(10, "Phone number should contain 10 digits"),
            legal_name: Yup.string().max(
              100,
              "La Razon Social debe tener menos de 100 caracteres"
            ),
          };
          return Yup.object().shape(validate);
        })
      }
      onSubmit={(values, { setStatus, setSubmitting }) => {
        setErrorList([]);
        if (values.phone && values.phone != originalPhone) {
          sendOtp(values.phone, false);
        } else {
          submitForm(values);
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
              {otpModal ? (
                <OTPModal
                  handleOk={validateOtp}
                  handleCancel={closeOtpModal}
                  btnSpinner={otpLoader}
                  visible={otpModal}
                  otpError={otpError}
                  resendOtp={resendOtp}
                />
              ) : null}
              <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                <span className="ant-page-header-heading-title">
                  Información
                </span>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                <Row className="ant-row">
                  <div className="ant-col ant-col-xs-24 imageContainer ant-col-xl-4 mt-3">
                    <img
                      src={data.logo || "/img/defaultImage.jpg"}
                      width="100%"
                    />
                  </div>
                  <div
                    className="ant-col ant-col-xs-24 ant-col-xl-2 mt-3 change-photo"
                    onChange={fileHandler}
                  >
                    {!imageSpinner ? (
                      <input
                        type="file"
                        className="change-image-button upload-input"
                        accept="image/*"
                      />
                    ) : null}
                    <Button className="change-image-button text-center">
                      {imageSpinner ? (
                        <LoadingOutlined style={{ fontSize: 20 }} spin />
                      ) : (
                        <>Change Image</>
                      )}
                    </Button>
                  </div>
                </Row>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                <div id="recaptcha-container"></div>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-3">
                <FormGroup>
                  <Label className="form-label">
                    Name<span className="red-color">*</span>
                  </Label>
                  <FormItem name="name">
                    <Field
                      name="name"
                      type="text"
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.name}
                      placeholder="Name"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-3">
                <FormGroup>
                  <Label className="form-label">
                    Razon Social<span className="red-color">*</span>
                  </Label>
                  <FormItem name="legal_name">
                    <Field
                      name="legal_name"
                      type="text"
                      disabled
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.legal_name}
                      placeholder="Razon Social"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-3">
                <FormGroup>
                  <Label className="form-label">
                    RFC<span className="red-color">*</span>
                  </Label>
                  <FormItem name="rfc">
                    <Field
                      name="rfc"
                      type="text"
                      disabled
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.rfc}
                      placeholder="RFC"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-3 width25">
                <FormGroup>
                  <Label className="form-label">
                    Regimen Fiscal<span className="red-color">*</span>
                  </Label>
                  <FormItem name="tax_system">
                    <Select
                      name="tax_system"
                      onBlur={handleBlur}
                      placeholder="Tax System"
                      className={"form-control p-0"}
                      value={values.tax_system}
                      onChange={handleChange}
                    >
                      {taxOptions.map((item, index) => {
                        return (
                          <Select.Option
                            key={index}
                            value={item.catalog_tax_regime.id}
                          >
                            {item.catalog_tax_regime.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2 width25">
                <FormGroup>
                  <Label className="form-label">
                    Pais<span className="red-color">*</span>
                  </Label>
                  <FormItem name="country">
                    <Select
                      name="country"
                      onBlur={handleBlur}
                      placeholder="Pais"
                      disabled
                      className={"form-control p-0"}
                      value={values.country}
                      onChange={handleChange}
                    >
                      {options.country &&
                        options.country.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Estado<span className="red-color">*</span>
                  </Label>
                  <FormItem name="state">
                    <Select
                      name="state"
                      onBlur={handleBlur}
                      placeholder="Estado"
                      disabled
                      className={"form-control p-0"}
                      value={values.state}
                      onChange={handleChange}
                    >
                      {options.state &&
                        options.state.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Ciudad<span className="red-color">*</span>
                  </Label>
                  <FormItem name="city">
                    <Select
                      name="city"
                      onBlur={handleBlur}
                      placeholder="Ciudad"
                      disabled
                      className={"form-control p-0"}
                      value={values.city}
                      onChange={handleChange}
                    >
                      {options.city &&
                        options.city.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Código postal<span className="red-color">*</span>
                  </Label>
                  <FormItem name="postalCode">
                    <Select
                      name="postalCode"
                      onBlur={handleBlur}
                      placeholder="Código postal"
                      disabled
                      className={"form-control p-0"}
                      value={values.postalCode}
                      onChange={handleChange}
                    >
                      {options.postalCode &&
                        options.postalCode.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Colonia<span className="red-color">*</span>
                  </Label>
                  <FormItem name="colony">
                    <Select
                      name="colony"
                      onBlur={handleBlur}
                      placeholder="Colonia"
                      disabled
                      className={"form-control p-0"}
                      value={values.colony}
                      onChange={handleChange}
                    >
                      {options.colony &&
                        options.colony.map((item, index) => {
                          return (
                            <Select.Option key={index} value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Calle<span className="red-color">*</span>
                  </Label>
                  <FormItem name="street">
                    <Field
                      name="street"
                      type="text"
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.street}
                      placeholder="Calle"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">Número interior</Label>
                  <FormItem name="inside_number">
                    <Field
                      name="inside_number"
                      type="text"
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.inside_number}
                      placeholder="Número interior"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Número externo<span className="red-color">*</span>
                  </Label>
                  <FormItem name="outside_number">
                    <Field
                      name="outside_number"
                      type="text"
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.outside_number}
                      placeholder="Número externo"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">Pagina web</Label>
                  <FormItem name="website">
                    <Field
                      name="website"
                      type="text"
                      validate={validateWebsite}
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.website}
                      placeholder="URL"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">Correo electronico</Label>
                  <FormItem name="supportEmail">
                    <Field
                      name="supportEmail"
                      type="text"
                      validate={validateEmail}
                      className={"form-control"}
                      onChange={handleChange}
                      value={values.supportEmail}
                      placeholder="Correo electronico"
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">Numero de Telefono</Label>
                  <FormItem name="phone" className="d-flex">
                    <input
                      type="text"
                      value="+52"
                      className="form-control width20 text-center p-0"
                      disabled
                    />
                    <Field
                      name="phone"
                      type="number"
                      className={`form-control ${
                        verified ? "widthRemain65" : "widthRemain80"
                      }`}
                      onChange={(e) => {
                        handleChange(e);
                        handlePhoneChange(e);
                      }}
                      value={values.phone}
                      placeholder="Numero de telefono"
                    />
                    {verified ? (
                      <img
                        className="verifiedNumber"
                        src={"/images/verified.png"}
                        width={"18px"}
                      />
                    ) : null}
                  </FormItem>
                </FormGroup>
              </div>
              {isLoaded && data.longitude && data.latitude ? (
                <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{
                      lat: data.latitude,
                      lng: data.longitude,
                    }}
                    zoom={15}
                  >
                    <Marker
                      draggable={true}
                      onDragEnd={(e) => {
                        setData({
                          ...data,
                          latitude: e.latLng.lat(),
                          longitude: e.latLng.lng(),
                        });
                      }}
                      position={{
                        lat: data.latitude,
                        lng: data.longitude,
                      }}
                    />
                  </GoogleMap>
                </div>
              ) : null}
              {errorList.length > 0 &&
                errorList.map((err, index) => {
                  return (
                    <div
                      key={index}
                      className="ant-col ant-col-xs-24 ant-col-xl-24 mt-4"
                    >
                      <div className={"alert alert-danger m-0 mt-3"}>{err}</div>
                    </div>
                  );
                })}
              <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-4">
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
                      value={
                        verified || !values.phone
                          ? "Guardar"
                          : "Verify Phone Number"
                      }
                    />
                  )}
                </FormGroup>
              </div>
            </Row>
          </>
        </Form>
      )}
    />
  );
}

export default Information;
