import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import alertContainer from "../../../utils/Alert";
import * as Yup from "yup";
import {
  createBenefit,
  getBenefitById,
  updateBenefit,
} from "../../../requests/plan";

function BenefitModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  const { visible, handleCancel, handleOk, selectedBenefit, selectedPlan } =
    props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);

  const [data, setData] = useState({
    title: "",
    description: "",
    module: false,
    visible: true,
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (selectedBenefit) {
      getOneBenefit(selectedBenefit.id);
    }
  }, [currentUser]);

  const getOneBenefit = (id) => {
    setSpinner(true);
    getBenefitById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200) {
          setData({
            title: response.data.title,
            description: response.data.description || "",
            visible: response.data.visible,
            module: response.data.module,
          });
        }
      },
      (error) => {
        setSpinner(false);
        console.log(error);
      }
    );
  };

  const handleSubmit = (values) => {
    setBtnSpinner(true);
    let payload = { ...values };
    payload["plan_id"] = selectedPlan;
    if (selectedBenefit) {
      updateBenefit(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        selectedBenefit.id,
        payload
      ).then(
        (response) => {
          setBtnSpinner(false);
          if (response.status === 200) {
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
          console.log(error);
        }
      );
    } else {
      createBenefit(
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
            handleOk();
          }
        },
        (error) => {
          setBtnSpinner(false);
          console.log(error);
        }
      );
    }
  };

  const isEdit = useMemo(() => {
    return selectedBenefit;
  }, [selectedBenefit]);

  return (
    <Modal
      className="entityModalContainer"
      title={isEdit ? "Actualizar Beneficios" : "Crear Beneficios"}
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
          validationSchema={Yup.object().shape({
            title: Yup.string().required("Se requiere la Title"),
            // description: Yup.string().required('Se requiere la Description')
          })}
          onSubmit={handleSubmit}
          render={({ values, handleChange, handleSubmit, handleBlur }) => (
            <Form>
              <>
                <Row gutter={25}>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <FormGroup>
                      <Label className="form-label">
                        Title<span className="red-color">*</span>
                      </Label>
                      <FormItem name="title">
                        <Field
                          name="title"
                          type="text"
                          placeholder="Entre aquí"
                          value={values.title}
                          onChange={handleChange}
                          className={"form-control"}
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <FormGroup>
                      <Label className="form-label">Description</Label>
                      <FormItem name="description">
                        <Field
                          name="description"
                          type="text"
                          placeholder="Entre aquí"
                          value={values.description}
                          onChange={handleChange}
                          className={"form-control"}
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                    <FormGroup>
                      <Label className="form-label">Visible</Label>
                      <FormItem name="visible">
                        <Select
                          name="visible"
                          onBlur={handleBlur}
                          placeholder="Visible"
                          className={"form-control p-0"}
                          value={values.visible}
                          onChange={handleChange}
                        >
                          <Select.Option value={true}>Yes</Select.Option>
                          <Select.Option value={false}>No</Select.Option>
                        </Select>
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12">
                    <FormGroup>
                      <Label className="form-label">Modulos</Label>
                      <FormItem name="module">
                        <Select
                          name="module"
                          onBlur={handleBlur}
                          placeholder="Modulos"
                          className={"form-control p-0"}
                          value={values.module}
                          onChange={handleChange}
                        >
                          <Select.Option value={true}>Yes</Select.Option>
                          <Select.Option value={false}>No</Select.Option>
                        </Select>
                      </FormItem>
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
                <Row>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-0">
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
                  </div>
                </Row>
              </>
            </Form>
          )}
        />
      )}
    </Modal>
  );
}

export default BenefitModal;
