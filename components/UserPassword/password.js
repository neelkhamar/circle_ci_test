import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { updateUserPassword } from "../../requests/profile";
import alertContainer from "../../utils/Alert";
import { Cards } from "../cards/frame/cards-frame";
import Heading from "../heading/heading";
import { BasicFormWrapper, ChangePasswordWrapper } from "./styled";

const Password = () => {
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });
  const [spinner, setSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    setSpinner(true);
    setErrorMessage("");
    updateUserPassword(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      values
    ).then(
      (response) => {
        if (response.status === 200) {
          alertContainer({
            title: "Password Updated Successfully!",
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          form.resetFields();
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
  };

  const handleCancel = (e) => {
    e.preventDefault();
    form.resetFields();
  };

  return (
    <ChangePasswordWrapper>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Contraseña</Heading>
          </div>
        }
      >
        <Row justify="center">
          <Col lg={12} sm={20} xs={24}>
            <BasicFormWrapper>
              <Form form={form} name="changePassword" onFinish={handleSubmit}>
                <Form.Item name="current_password" label="Contraseña actual">
                  <Input.Password className="paddingLeft2" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Contraseña nueva"
                  rules={[{ min: 6, type: "string" }]}
                >
                  <Input.Password className="paddingLeft2" />
                </Form.Item>
                <p className="input-message">Minimo 6 caracteres</p>
                <Form.Item>
                  <div className="setting-form-actions">
                    <Button htmlType="submit" type="primary">
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
                </Form.Item>
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
            </BasicFormWrapper>
          </Col>
        </Row>
      </Cards>
    </ChangePasswordWrapper>
  );
};

export default Password;
