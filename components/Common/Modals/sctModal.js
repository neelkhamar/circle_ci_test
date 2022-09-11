import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import * as Yup from "yup";
import {
  createSCT,
  getSCTById,
  getSctTypes,
  updateSCT,
} from "../../../requests/carta-porte";
import alertContainer from "../../../utils/Alert";

function SctModal(props) {
  const { visible, handleCancel, handleOk, selectedSCT } = props;
  const [spinner, setSpinner] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [btnValues, setBtnValue] = useState("Crear SCT");

  const [data, setData] = useState({
    activeValue: false,
    number: "",
  });
  const [types, setTypes] = useState([]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (selectedSCT) {
        getSct(selectedSCT);
        setBtnValue("Actualizar SCT");
      } else {
        getTypes();
      }
    }

    return () => (mounted = false);
  }, []);

  const getTypes = () => {
    setSpinner(true);
    getSctTypes(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        setTypes(response.data.data);
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const getSct = (id) => {
    setSpinner(true);
    getSCTById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          let { active, catalog_sct_type, number } = response.data;
          setData({
            activeValue: active,
            sctTypes: catalog_sct_type.id,
            number: number,
          });
        }
        getTypes();
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
      title={selectedSCT ? "Nuevo Permiso SCT" : "Actualizar Permiso SCT"}
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
            sctTypes: Yup.string().required("Se requiere la SCT Types"),
            number: Yup.string()
              .required("Se requiere la Número")
              .max(20, "La Número debe tener menos de 20 caracteres"),
          })}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus();
            setBtnSpinner(true);
            setErrorList([]);
            let payload = {
              catalog_sct_type_id: values.sctTypes,
              number: values.number,
              active: values.activeValue,
            };
            if (selectedSCT) {
              updateSCT(
                currentUser.accessToken,
                currentUser.uid,
                currentUser.client,
                payload,
                selectedSCT
              ).then(
                (response) => {
                  setBtnSpinner(false);
                  console.log(response);
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
                  console.log(error, error.response);
                  // setErrorList(error.response.data.errors);
                }
              );
            } else {
              createSCT(
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
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <FormGroup>
                      <div>
                        <Label className="form-label">
                          SCT Types<span className="red-color">*</span>
                        </Label>
                        <FormItem name="sctTypes">
                          <Select
                            showSearch
                            name="sctTypes"
                            onBlur={handleBlur}
                            placeholder="SCT Types"
                            className={"form-control p-0"}
                            value={values.sctTypes}
                            onChange={handleChange}
                            filterOption={(input, option) => {
                              let str = "";
                              option.children.map((item) => {
                                str = str + item;
                              });
                              return (
                                str
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                          >
                            {types.map((item, index) => {
                              return (
                                <Select.Option value={item.id} key={index}>
                                  {item.code} - {item.name}
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
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                    <FormGroup>
                      <Label className="form-label opacity0">
                        Active<span className="red-color">*</span>
                      </Label>
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

export default SctModal;
