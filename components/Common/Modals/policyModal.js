import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import {
  createPolicy,
  getPolicyById,
  updatePolicy,
} from "../../../requests/carta-porte";
import alertContainer from "../../../utils/Alert";

function PolicyModal(props) {
  const { visible, handleCancel, handleOk, selectedPolicy } = props;
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [btnValues, setBtnValue] = useState("Crear Policy");

  const [data, setData] = useState({
    activeValue: false,
    name: "",
    number: "",
    insurance_types: undefined,
  });
  const types = [
    {
      name: "Seguro de Mercancias",
      id: 1,
    },
    {
      name: "Seguro Daño Ambiental",
      id: 2,
    },
  ];

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (selectedPolicy) {
        getPolicy(selectedPolicy);
      }
    }

    return () => (mounted = false);
  }, []);

  const getPolicy = (id) => {
    setSpinner(true);
    getPolicyById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          let result = response.data;
          setData({
            activeValue: result.active,
            name: result.name,
            number: result.number,
            insurance_types: result.insurance_type,
          });
          setBtnValue("Actualizar Policy");
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  return (
    <Modal
      className="entityModalContainer"
      title={selectedPolicy ? "Nueva Poliza" : "Actualizar Poliza"}
      visible={visible}
      onOk={handleOk}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[]}
    >
      {spinner ? (
        <div className="text-center">
          <LoadingOutlined style={{ fontSize: 40, color: "blue" }} spin />
        </div>
      ) : (
        <Formik
          initialValues={data}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            insurance_types: Yup.string().required(
              "Se requiere la Insurance Types"
            ),
            number: Yup.string()
              .required("Se requiere la Número")
              .min(3, "La Número debe tener más de 3 caracteres")
              .max(20, "La Número debe tener menos de 20 caracteres"),
            name: Yup.string()
              .required("Se requiere la Name")
              .min(3, "La Name debe tener más de 3 caracteres")
              .max(100, "La Name debe tener menos de 100 caracteres"),
          })}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus();
            setBtnSpinner(true);
            let payload = {
              name: values.name,
              insurance_type: values.insurance_types,
              number: values.number,
              active: values.activeValue,
            };
            if (selectedPolicy) {
              updatePolicy(
                currentUser.accessToken,
                currentUser.uid,
                currentUser.client,
                payload,
                selectedPolicy
              ).then(
                (response) => {
                  setBtnSpinner(false);
                  if (response.status === 200 && response.data.message) {
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
                  setErrorList(error.response.data.errors);
                }
              );
            } else {
              createPolicy(
                currentUser.accessToken,
                currentUser.uid,
                currentUser.client,
                payload
              ).then(
                (response) => {
                  setBtnSpinner(false);
                  if (response.status === 201 && response.data.message) {
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
                  setErrorList(error.response.data.errors);
                }
              );
            }
          }}
          render={({ values, handleChange, handleBlur }) => (
            <Form>
              <>
                <Row className="mt-3 ant-row">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <div>
                        <Label className="form-label">
                          Name<span className="red-color">*</span>
                        </Label>
                        <FormItem name="name">
                          <Field
                            name="name"
                            type="text"
                            className={"form-control"}
                            placeholder="Name"
                            value={values.name}
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
                          Número<span className="red-color">*</span>
                        </Label>
                        <FormItem name="number">
                          <Field
                            name="number"
                            type="text"
                            className={"form-control"}
                            placeholder="Número"
                            value={values.number}
                            onChange={handleChange}
                          />
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                    <FormGroup>
                      <div>
                        <Label className="form-label">
                          Insurance Type<span className="red-color">*</span>
                        </Label>
                        <FormItem name="insurance_types">
                          <Select
                            showSearch
                            name="insurance_types"
                            onBlur={handleBlur}
                            placeholder="Insurance Type"
                            className={"form-control p-0"}
                            value={values.insurance_types}
                            onChange={handleChange}
                            filterOption={(input, option) => {
                              return (
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {types.map((item, index) => {
                              return (
                                <Select.Option value={item.id} key={index}>
                                  {item.name}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <div>
                        <label className="pb-3">
                          <Field
                            type="checkbox"
                            name="activeValue"
                            className="mr-3"
                            checked={values.activeValue}
                            onChange={handleChange}
                          />
                          <b>Active</b>
                        </label>
                      </div>
                    </FormGroup>
                  </div>
                </Row>
                {errorList.length > 0 ? (
                  <Row>
                    {errorList.map((item, index) => {
                      return (
                        <Col md={24} key={index}>
                          <div className={"alert alert-danger m-0 mt-3"}>
                            {item}
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                ) : (
                  <></>
                )}
                <Row className={"mt-4"}>
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
                          value={btnValues}
                        />
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

export default PolicyModal;
