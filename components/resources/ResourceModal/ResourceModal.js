import { LoadingOutlined } from "@ant-design/icons";
import { Button, Collapse, Modal, Spin } from "antd";
import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import {
  createPremiumResource,
  getPremiumResourceById,
  updatePremiumResourceById,
} from "../../../requests/resource";
import alertContainer from "../../../utils/Alert";
import schema from "./schema";

const { Panel } = Collapse;
const customPanelStyle = {
  background: "#ffffff",
  borderRadius: 5,
  marginBottom: 5,
  border: "1px solid #F1F2F6",
};

function ResourceModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  const { visible, handleCancel, handleOk, selectedResource } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);

  const [data, setData] = useState({
    id: null,
    name: "",
    description: "",
    namespace: "",
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (selectedResource) {
      getOneResource(selectedResource.id);
    }
  }, [currentUser]);

  const getOneResource = (id) => {
    setSpinner(true);
    getPremiumResourceById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          let resp = response.data.data;
          setData({
            ...data,
            id: resp.id,
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
    if (selectedResource) {
      submitRequest = updatePremiumResourceById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        values,
        selectedResource.id
      );
    } else {
      submitRequest = createPremiumResource(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        values
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
          error?.response?.data?.errors || ["Failed to update resource!"]
        );
      }
    );
  };

  const isEdit = useMemo(() => {
    return selectedResource;
  }, [selectedResource]);

  return (
    <Modal
      className="entityModalContainer"
      title={isEdit ? "Editar Modulo" : "Crear Modulo"}
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
                      <Label className="form-label">Namespace</Label>
                      <div className="d-flex">
                        <Field
                          name="namespace"
                          type="text"
                          value={values.namespace}
                          className={"form-control"}
                        />
                      </div>
                      {errors.namespace && touched.namespace && (
                        <div className="invalid-feedback d-block">
                          {errors.namespace}
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

export default ResourceModal;
