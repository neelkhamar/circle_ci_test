import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { Field, Form, Formik } from "formik";
import { Select } from "formik-antd";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import {
  createPremiumResourceAction,
  getPremiumResourceActionById,
  updatePremiumResourceActionById,
} from "../../../requests/resource-action";
import alertContainer from "../../../utils/Alert";
import schema from "./schema";

const HTTP_METHODS = [
  { label: "GET", value: "get" },
  { label: "POST", value: "post" },
  { label: "PUT", value: "put" },
  { label: "PATCH", value: "patch" },
  { label: "DELETE", value: "delete" },
];

function ResourceActionModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  const {
    visible,
    handleCancel,
    handleOk,
    resourceId,
    selectedResourceAction,
  } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);

  const [data, setData] = useState({
    id: null,
    name: "",
    description: "",
    route_path: "",
    http_method: "get",
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (selectedResourceAction) {
      getOneResourceAction(selectedResourceAction.id);
    }
  }, [currentUser]);

  const getOneResourceAction = (id) => {
    setSpinner(true);
    getPremiumResourceActionById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          let resp = response.data;
          setData({
            ...data,
            ...resp,
          });
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const handleSubmit = (values) => {
    let submitRequest = null;
    let payload = { ...values };
    if (selectedResourceAction) {
      submitRequest = updatePremiumResourceActionById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload,
        selectedResourceAction.id
      );
    } else {
      payload = { ...values, premium_resource_id: resourceId };
      submitRequest = createPremiumResourceAction(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      );
    }

    if (!submitRequest) return;

    setBtnSpinner(true);
    showError("");

    submitRequest.then(
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
          error?.response?.data?.errors || ["Failed to save action!"]
        );
      }
    );
  };

  const isEdit = useMemo(() => {
    return selectedResourceAction;
  }, [selectedResourceAction]);

  return (
    <Modal
      className="entityModalContainer"
      title={isEdit ? "Actualizar Accion" : "Crear Accion"}
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
          render={({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form>
              <>
                <Row className="ant-row mb-3">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Nombre</Label>
                      <div className="d-flex">
                        <Field
                          name="name"
                          type="text"
                          value={values.name}
                          className={"form-control"}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <div className="invalid-feedback d-block">
                          {errors.name}
                        </div>
                      )}
                    </FormGroup>
                  </div>

                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Metodo Http</Label>
                      <div className="d-flex">
                        <Select
                          name="http_method"
                          className={"form-control p-0"}
                          value={values.http_method}
                          onChange={handleChange}
                        >
                          {HTTP_METHODS.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.value}>
                                {item.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </div>
                      {errors.http_method && touched.http_method && (
                        <div className="invalid-feedback d-block">
                          {errors.http_method}
                        </div>
                      )}
                    </FormGroup>
                  </div>

                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <Label className="form-label">Route path</Label>
                      <div className="d-flex">
                        <Field
                          name="route_path"
                          type="text"
                          value={values.route_path}
                          className={"form-control"}
                        />
                      </div>
                      {errors.route_path && touched.route_path && (
                        <div className="invalid-feedback d-block">
                          {errors.route_path}
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
                          type="text"
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
                          {isEdit ? "Actualizar" : "Crear"}
                        </Button>
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

export default ResourceActionModal;
