import React, { useEffect, useState } from "react";
import { Button, Modal, Spin, Select } from "antd";
import { Formik, Field, Form } from "formik";
import { useSelector } from "react-redux";
import { FormGroup, Col, Row, Label, Spinner } from "reactstrap";
import { getUsers, sendCouponToUsers } from "../../../requests/coupon";
import { LoadingOutlined } from "@ant-design/icons";
import alertContainer from "../../../utils/Alert";
import CouponSendFormWrapper from "./style";
import schema from "./schema";

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
const { Option } = Select;

function CouponSendModal(props) {
  const { visible, handleCancel, handleOk, selectedCoupon } = props;

  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [dropdownSpinner, setDropdownSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [users, setUsers] = useState([]);

  const [data, setData] = useState({
    coupon_users: [],
    description: "",
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const fetchCompanyUsers = (key) => {
    setSpinner(true);
    getUsers(currentUser.accessToken, currentUser.uid, currentUser.client, {
      q: key,
    }).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          setUsers(response.data.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleSubmit = (values) => {
    setBtnSpinner(true);
    showError("");

    const couponId = selectedCoupon.id;
    sendCouponToUsers(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      couponId,
      values
    ).then(
      (response) => {
        setBtnSpinner(false);
        if ([200, 201].includes(response.status) && response.data.message) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          handleOk();
        }
      },
      (error) => {
        setBtnSpinner(false);
        setErrorList(
          error?.response?.data?.errors || ["Failed to send coupon!"]
        );
      }
    );
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchCompanyUsers();
    }

    return () => (mounted = false);
  }, []);

  return (
    <Modal
      className="entityModalContainer"
      title={"Enviar cupon por email"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      {spinner ? (
        <div className="text-center pt-4">
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <Formik
          initialValues={data}
          enableReinitialize={true}
          validationSchema={schema}
          onSubmit={handleSubmit}
          render={({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleSubmit,
          }) => (
            <Form>
              <CouponSendFormWrapper>
                <Row className="ant-row mb-3">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Administradores de compañias
                      </Label>
                      <div className="d-flex">
                        <Select
                          showSearch
                          name="coupon_users"
                          className="form-control p-0"
                          placeholder="Select users"
                          mode="multiple"
                          filterOption={(input, option) => {
                            return (
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          onChange={(val) => setFieldValue("coupon_users", val)}
                          notFoundContent={
                            dropdownSpinner ? (
                              <div className="text-center">
                                <LoadingOutlined
                                  style={{ fontSize: 18, color: "blue" }}
                                  spin
                                />
                              </div>
                            ) : null
                          }
                        >
                          {users.length > 0 &&
                            users.map((item, index) => {
                              return (
                                <Select.Option value={item.id} key={index}>
                                  {item.uid}
                                </Select.Option>
                              );
                            })}
                        </Select>
                      </div>
                      {errors.coupon_users && touched.coupon_users && (
                        <div className="invalid-feedback d-block">
                          {errors.coupon_users}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <Label className="form-label">Descripcion</Label>
                      <div className="d-flex">
                        <Field
                          name="description"
                          component="textarea"
                          rows="4"
                          value={values.description}
                          className={"form-control"}
                        />
                      </div>
                      {errors.description && touched.description && (
                        <div className="invalid-feedback d-block">
                          {errors.description}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                </Row>
                {errorAlert ? (
                  <Row>
                    <Col md={24}>
                      <div className={"alert alert-danger m-0"}>
                        {errorAlert}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {errorList.length > 0 &&
                  errorList.map((err, index) => {
                    return (
                      <div key={index} className={"alert alert-danger"}>
                        {err}
                      </div>
                    );
                  })}
                <Row className={errorAlert ? "mt-3" : "mt-4"}>
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
                        <Button
                          className="entityBtn"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Enviar
                        </Button>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </CouponSendFormWrapper>
            </Form>
          )}
        />
      )}
    </Modal>
  );
}

export default CouponSendModal;
