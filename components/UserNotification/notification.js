import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Col, Form, Row, Switch } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile, updateUserAlertType } from "../../requests/profile";
import alertContainer from "../../utils/Alert";
import { Button } from "../buttons/buttons";
import { Cards } from "../cards/frame/cards-frame";
import Heading from "../heading/heading";
import { NotificationWrapper } from "./styled";

const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: 0,
  padding: 0,
};

const Notification = () => {
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const [form] = Form.useForm();
  const [alertType, setAlertType] = useState("nothing");
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notificationData, setNotificationData] = useState({
    alert_type: false,
  });

  const fetchProfile = () => {
    if (currentUser.userDetails) {
      let output = JSON.parse(currentUser.userDetails);
      setNotificationData({
        email_alert_type: output.alert_type == "email",
        telephone_alert_type: output.alert_type == "telephone",
        nothing_alert_type: output.alert_type == "nothing",
      });
    } else {
      getProfileDetails();
    }
  };

  const getProfileDetails = () => {
    getUserProfile(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then((response) => {
      if (response.status === 200) {
        let output = response.data.data;
        setNotificationData({
          email_alert_type: output.alert_type == "email",
          telephone_alert_type: output.alert_type == "telephone",
          nothing_alert_type: output.alert_type == "nothing",
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

  useEffect(() => {
    form.setFieldsValue(notificationData);
  }, [notificationData]);

  const handleEmailChange = (checked, e) => {
    if (checked) {
      setAlertType("email");
    } else {
      setAlertType("nothing");
    }
    form.setFields([
      {
        name: "telephone_alert_type",
        value: !checked,
      },
      {
        name: "nothing_alert_type",
        value: !checked,
      },
    ]);
  };

  const handleTelephoneChange = (checked, e) => {
    if (checked) {
      setAlertType("telephone");
    } else {
      setAlertType("nothing");
    }
    form.setFields([
      {
        name: "email_alert_type",
        value: !checked,
      },
      {
        name: "nothing_alert_type",
        value: !checked,
      },
    ]);
  };

  const handleNothingChange = (checked, e) => {
    if (checked) {
      setAlertType("nothing");
    } else {
      setAlertType("email");
    }
    form.setFields([
      {
        name: "email_alert_type",
        value: checked ? false : true,
      },
      {
        name: "telephone_alert_type",
        value: false,
      },
    ]);
  };

  const handleSubmit = (values) => {
    setSpinner(true);
    let paylod = { alert_type: alertType };
    updateUserAlertType(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      paylod
    ).then(
      (response) => {
        if (response.status === 200) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
        } else {
          console.log(response.data.errors);
        }
        getProfileDetails();
        setSpinner(false);
      },
      (error) => {
        setErrorMessage(error.response.data.errors.full_messages);
        setSpinner(false);
      }
    );
  };

  const handleCancel = (e) => {
    e.preventDefault();
    form.resetFields();
  };

  return (
    <NotificationWrapper>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Notificaciones</Heading>
          </div>
        }
      >
        <Form
          form={form}
          name="edit_notification"
          initialValues={notificationData}
          onFinish={handleSubmit}
        >
          <Row gutter={15}>
            <Col xs={24}>
              <div className="notification-box-single">
                <Cards
                  headless
                  bodyStyle={{ backgroundColor: "#F7F8FA", borderRadius: 10 }}
                >
                  <div
                    style={{
                      height: "50px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className="notification-header"
                  >
                    <Heading className="notification-header__text" as="h4">
                      Configuracion
                    </Heading>
                    {/* <Link className="btn-toggle" to="#">
                      Toggle all
                    </Link> */}
                  </div>
                  <div className="notification-body">
                    <Cards headless>
                      <nav>
                        <ul
                          style={{
                            margin: 0,
                            padding: 0,
                          }}
                        >
                          <li style={listStyle}>
                            <div className="notification-list-single">
                              <Heading
                                className="notification-list-single__title"
                                as="h4"
                              >
                                Deshabilitar
                              </Heading>
                              <p>Deshabilita Correo electronico y SMS </p>
                            </div>
                            <Form.Item
                              name="nothing_alert_type"
                              valuePropName="checked"
                            >
                              <Switch
                                checkedChildren="Si"
                                unCheckedChildren="No"
                                onChange={handleNothingChange}
                              />
                            </Form.Item>
                          </li>
                          <li style={listStyle}>
                            <div className="notification-list-single">
                              <Heading
                                className="notification-list-single__title"
                                as="h4"
                              >
                                Enviar Email
                              </Heading>
                              <p>
                                Cada que ocurre un evento importante se enviara
                                un correo electronico
                              </p>
                            </div>
                            <Form.Item
                              name="email_alert_type"
                              valuePropName="checked"
                            >
                              <Switch
                                checkedChildren="Email"
                                unCheckedChildren="No"
                                onChange={handleEmailChange}
                              />
                            </Form.Item>
                          </li>
                          <li style={listStyle}>
                            <div className="notification-list-single">
                              <Heading
                                className="notification-list-single__title"
                                as="h4"
                              >
                                Enviar SMS
                              </Heading>
                              <p>
                                Cada que ocurre un evento importante se enviara
                                un SMS a su numero telefonico
                              </p>
                            </div>
                            <Form.Item
                              name="telephone_alert_type"
                              valuePropName="checked"
                            >
                              <Switch
                                checkedChildren="SMS"
                                unCheckedChildren="No"
                                onChange={handleTelephoneChange}
                              />
                            </Form.Item>
                          </li>
                        </ul>
                      </nav>
                    </Cards>
                  </div>
                </Cards>
              </div>
            </Col>
          </Row>
          <div className="notification-actions">
            <Button size="default" htmlType="submit" type="primary">
              Guardar
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
      </Cards>
    </NotificationWrapper>
  );
};

export default Notification;
