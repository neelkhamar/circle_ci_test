import { LoadingOutlined } from "@ant-design/icons";
import { Button, Collapse, Modal, Spin } from "antd";
import FeatherIcon from "feather-icons-react";
import { Field, Form, Formik } from "formik";
import { Select } from "formik-antd";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/es";
import { useSelector } from "react-redux";
import { Col, FormGroup, Label, Row, Spinner } from "reactstrap";
import {
  createPlan,
  getPlanById,
  updatePlanById,
} from "../../../requests/plan";
import alertContainer from "../../../utils/Alert";
import ModuleActionCheckbox from "../MouldeActionCheckbox";
import schema from "./schema";
import { AllowedModuleWrapper } from "./style";

const { Panel } = Collapse;
const customPanelStyle = {
  background: "#ffffff",
  borderRadius: 5,
  marginBottom: 5,
  border: "1px solid #F1F2F6",
};

const PLAN_INTERVALS = [{ label: "Mes", value: "month" }];

const PLAN_CURRENCIES = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "MXN", value: "mxn" },
];

function PlanModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  const { visible, handleCancel, handleOk, selectedPlan } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [modules, setModules] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);

  const [data, setData] = useState({
    id: null,
    active: true,
    amount: 0,
    priority: "",
    color: "",
    currency: "mxn",
    interval: "month",
    metadata: {},
    trial_period_days: null,
    name: "",
  });

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (selectedPlan) {
      getOnePlan(selectedPlan.id);
    }
  }, [currentUser]);

  const getOnePlan = (id) => {
    setSpinner(true);
    getPlanById(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      id
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data) {
          let resp = response.data.plan.data;
          setData({
            ...data,
            id: resp.id,
            ...resp.attributes,
          });
          setModules(response.data.premium_resources.data);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const onModuleChange = (values, module, actions = []) => {
    const cloned = _.cloneDeep(values);
    const namespace = module.attributes.namespace;
    cloned.metadata = {
      ...cloned.metadata,
      [namespace]: { ...cloned.metadata[namespace], actions: actions },
    };
    setData(cloned);
  };

  const handleSubmit = (values) => {
    setBtnSpinner(true);
    showError("");

    let payload = {
      plan: {
        name: values.name,
        active: values.active,
        amount: values.amount,
        currency: values.currency,
        color: values.color,
        priority: values.priority,
        interval: values.interval,
        interval_count: 1,
        metadata: values.metadata,
      },
    };
    let submitRequest = null;
    if (selectedPlan) {
      submitRequest = updatePlanById(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload,
        selectedPlan.id
      );
    } else {
      submitRequest = createPlan(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      );
    }

    if (!submitRequest) return false;

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
        setErrorList(error?.response?.data?.errors || ["Failed to save plan!"]);
      }
    );
  };

  const isEdit = useMemo(() => {
    return selectedPlan;
  }, [selectedPlan]);

  const onJsonChange = (e) => {
    if (!e.error) {
      setData({ ...data, metadata: e.jsObject });
    }
  };

  return (
    <Modal
      className="entityModalContainer"
      title={isEdit ? "Actualizar Plan" : "Crear Plan"}
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
                          //disabled={isEdit}
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
                      <Label className="form-label">Intervalo</Label>
                      <div className="d-flex">
                        <Select
                          name="interval"
                          className={
                            "form-control p-0" +
                            (errors.interval && touched.interval
                              ? " is-invalid"
                              : "")
                          }
                          value={values.interval}
                          onChange={handleChange}
                          disabled={isEdit}
                        >
                          {PLAN_INTERVALS.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.value}>
                                {item.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </div>
                      {errors.interval && touched.interval && (
                        <div className="invalid-feedback d-block">
                          {errors.interval}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Precio</Label>
                      <div className="d-flex">
                        <Field
                          name="amount"
                          type="number"
                          value={values.amount}
                          className={"form-control"}
                          disabled={isEdit}
                        />
                      </div>
                      {errors.amount && touched.amount && (
                        <div className="invalid-feedback d-block">
                          {errors.amount}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Moneda</Label>
                      <div className="d-flex">
                        <Select
                          name="currency"
                          className={"form-control p-0"}
                          value={values.currency}
                          onChange={handleChange}
                          disabled={isEdit}
                        >
                          {PLAN_CURRENCIES.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.value}>
                                {item.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </div>
                      {errors.currency && touched.currency && (
                        <div className="invalid-feedback d-block">
                          {errors.currency}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Orden de prioridad</Label>
                      <div className="d-flex">
                        <Field
                          name="priority"
                          type="text"
                          value={values.priority}
                          className={"form-control"}
                          //disabled={isEdit}
                        />
                      </div>
                      {errors.priority && touched.priority && (
                        <div className="invalid-feedback d-block">
                          {errors.priority}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">Color</Label>
                      <div className="d-flex">
                        <Field
                          name="color"
                          type="text"
                          value={values.color}
                          className={"form-control"}
                          //disabled={isEdit}
                        />
                      </div>
                      {errors.color && touched.color && (
                        <div className="invalid-feedback d-block">
                          {errors.color}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <Label className="form-label">Modulos Permitidos</Label>
                      <AllowedModuleWrapper>
                        <Collapse
                          bordered={false}
                          defaultActiveKey={["1"]}
                          expandIcon={({ isActive }) => (
                            <FeatherIcon
                              icon={isActive ? "minus" : "plus"}
                              size={14}
                            />
                          )}
                        >
                          {modules.map((module) => {
                            const allActions = module.attributes.actions;
                            const moduleMetadata =
                              values.metadata[module.attributes.namespace];
                            const allowedActions =
                              moduleMetadata && moduleMetadata.actions
                                ? moduleMetadata.actions
                                : [];

                            return (
                              <Panel
                                header={module.attributes.name}
                                key={`module-${module.id}`}
                                style={customPanelStyle}
                              >
                                <ModuleActionCheckbox
                                  items={allActions}
                                  value={allowedActions}
                                  onChange={(selected) =>
                                    onModuleChange(values, module, selected)
                                  }
                                />
                              </Panel>
                            );
                          })}
                        </Collapse>
                      </AllowedModuleWrapper>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <Label className="form-label">Metadata Configuracion</Label>
                    <JSONInput
                      id="metadata"
                      placeholder={values.metadata}
                      locale={locale}
                      onChange={onJsonChange}
                      height="550px"
                    />
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <div>
                        <label className="pb-3">
                          <Field
                            type="checkbox"
                            name="active"
                            className="mr-3"
                            checked={values.active}
                            onChange={handleChange}
                          />
                          <b>Activo</b>
                        </label>
                      </div>
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
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
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

export default PlanModal;
