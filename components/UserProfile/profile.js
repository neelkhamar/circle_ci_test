import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Select } from "antd";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "reactstrap";
import { getUserProfile, updateUserProfile } from "../../requests/profile";
import alertContainer from "../../utils/Alert";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import Heading from "../heading/heading";

// Form initial state
const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  second_first_name: "",
  second_last_name: "",
  phone_number: "",
};

const { Option } = Select;

const Profile = () => {
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileData, setProfileData] = useState(INITIAL_STATE);
  const [validatePhone, setValidatePhone] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [form] = Form.useForm();
  const [confirmationResult, setConfirmationResult] = useState();
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [validatedNumber, setValidatedNumber] = useState("");
  const [currentObj, setCurrentObj] = useState(null);

  const fetchProfile = () => {
    if (currentUser.userDetails) {
      let output = JSON.parse(currentUser.userDetails);
      console.log(output);
      setProfileData({
        first_name: output.first_name,
        last_name: output.last_name,
        second_first_name: output.second_first_name,
        second_last_name: output.second_last_name,
        phone_number: output.phone_number,
      });
      setValidatedNumber(output.phone_number);
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
        setProfileData({
          first_name: output.first_name,
          last_name: output.last_name,
          second_first_name: output.second_first_name,
          second_last_name: output.second_last_name,
          phone_number: output.phone_number,
        });
        setValidatedNumber(output.phone_number);
      }
    });
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
      setRecaptchaVerifier(captcha);
      fetchProfile();
    }

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    form.setFieldsValue(profileData);
  }, [profileData]);

  const handleSubmit = (values) => {
    if (
      values.phone_number.length > 9 &&
      values.phone_number != validatedNumber
    ) {
      setCurrentObj(values);
      sendVerificationCode(values.phone_number);
    } else {
      setSpinner(true);
      setCurrentObj(null);
      updateUserProfile(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        values
      ).then(
        (response) => {
          if (response.status === 200) {
            setValidatePhone(false);
            alertContainer({
              title: response.data.message,
              text: "",
              icon: "success",
              showConfirmButton: false,
            });
            fetchProfileDetails();
          } else {
            console.log(response.data.errors);
          }
          setSpinner(false);
        },
        (error) => {
          setErrorMessage(error.response.data.errors.full_messages);
          setSpinner(false);
        }
      );
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (showOtpField) setShowOtpField(!showOtpField);
    if (validatePhone) setValidatePhone(!validatePhone);
    setCurrentObj(null);
    form.resetFields();
  };

  const auth = getAuth();

  const sendVerificationCode = (phone_number) => {
    setSpinner(true);
    var phoneNumber = "+52" + phone_number;

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setValidatePhone(true);
        setShowOtpField(true);
        alertContainer({
          title: "OTP send successfully.",
          text: "you receive otp on this number " + phoneNumber,
          icon: "success",
          showConfirmButton: false,
        });
        setSpinner(false);
      })
      .catch((error) => {
        setValidatePhone(false);
        setShowOtpField(false);
        console.log(error, "error");
        setSpinner(false);
      });
  };

  const ValidateOtp = (e) => {
    var otp = e.target.value;
    if (otp.length == 6 && confirmationResult != null) {
      setSpinner(true);
      confirmationResult
        .confirm(otp)
        .then((result) => {
          setShowOtpField(false);
          alertContainer({
            title: "OTP verified successfully.",
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          setValidatedNumber(currentObj.phone_number);
          setSpinner(false);
          // success
        })
        .catch((err) => {
          form.setFields([
            {
              name: "otp",
              errors: ["Invalid OTP code."],
              value: "",
            },
          ]);
          setShowOtpField(true);
          setSpinner(false);
        });
    }
  };

  return (
    <Cards
      title={
        <div className="setting-card-title">
          <Heading as="h4">Editar Perfil</Heading>
        </div>
      }
    >
      <Row gutter={25}>
        <Form
          form={form}
          name="editProfile"
          initialValues={profileData}
          onFinish={handleSubmit}
        >
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            <Form.Item name="first_name" label="Nombre">
              <Input className="form-control" value={profileData.first_name} />
            </Form.Item>
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            <Form.Item name="last_name" label="Segundo Nombre">
              <Input className="form-control" value={profileData.last_name} />
            </Form.Item>
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            <Form.Item name="second_first_name" label="Apellido Paterno">
              <Input
                className="form-control"
                value={profileData.second_first_name}
              />
            </Form.Item>
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            <Form.Item name="second_last_name" label="Apellido Materno">
              <Input
                className="form-control"
                value={profileData.second_last_name}
              />
            </Form.Item>
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            <Form.Item
              name="phone_number"
              label="Numero de Telefono"
              rules={[
                {
                  pattern: RegExp(/^[0-9]{10}$/),
                  message: "Por favor ingresar un numero de telefonico valido",
                },
              ]}
            >
              <Input
                addonBefore="+52"
                disabled={showOtpField}
                value={profileData.phone_number}
              />
            </Form.Item>
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            {showOtpField ? (
              <Form.Item
                name="otp"
                label="Otp"
                onChange={ValidateOtp}
                rules={[{ required: true, len: 6 }]}
              >
                <Input className="form-control" value="" maxLength={6} />
              </Form.Item>
            ) : (
              <></>
            )}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-12">
            <div id="recaptcha-container"></div>
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-xl-24">
            <div className="setting-form-actions">
              <Button size="default" htmlType="submit" type="primary">
                Verificar & Actualizar
                {spinner ? (
                  <LoadingOutlined
                    style={{ fontSize: 18, color: "white" }}
                    spin
                  />
                ) : (
                  <></>
                )}
              </Button>
              &nbsp; &nbsp;
              <Button size="default" onClick={handleCancel} type="light">
                Cancelar
              </Button>
            </div>
          </div>
        </Form>
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 yScrollAuto">
          {errorMessage ? (
            <div className="ant-col ant-col-xs-24 ant-col-xl-24">
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
      </Row>
    </Cards>
  );
};

export default Profile;
