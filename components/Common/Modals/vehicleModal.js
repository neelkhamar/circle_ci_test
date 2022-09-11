import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spin } from "antd";
import * as Yup from "yup";
import { Formik, Field, Form } from "formik";
import { useSelector } from "react-redux";
import { FormGroup, Col, Row, Label, Spinner } from "reactstrap";
import {
  getVehicleById,
  getVehicleOption,
  saveVehicle,
  updateVehicle,
} from "../../../requests/carta-porte";
import { LoadingOutlined } from "@ant-design/icons";
import alertContainer from "../../../utils/Alert";
import { FormItem, Select } from "formik-antd";
import { ErrorMessages } from "../Data/errorMessages";

function VehicleModal(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  const isMounted = useRef(false);
  const { visible, handleCancel, handleOk, selectedVehicle } = props;
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [errorAlert, showError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [data, setData] = useState({
    numberPlate: "",
    brand: "",
    model: "",
    year: "",
    type: "",
    seriel_number: "",
    insurer_name: "",
    insurance_policy_number: "",
  });
  const [btnValue, setBtnValue] = useState("Crear Vehiculos");

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    isMounted.current = true;
    if (isMounted) {
      fetchOptions();
      if (selectedVehicle) {
        setBtnValue("Actualizar vehículo");
        getOneVehicle(selectedVehicle);
      }
    }

    return () => {
      isMounted.current = false;
      setTypeOptions([]);
      setBtnValue("");
      setData({});
    };
  }, []);

  const fetchOptions = () => {
    setSpinner(true);
    getVehicleOption(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client
    ).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data.data) {
          let resp = response.data.data;
          if (!selectedVehicle && resp.length) {
            setData({
              ...data,
              type: resp[0].id,
            });
          }
          setTypeOptions(resp);
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const getOneVehicle = (id) => {
    setSpinner(true);
    getVehicleById(
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
            numberPlate: resp.license_plate,
            brand: resp.brand,
            model: resp.model,
            year: parseInt(resp.year),
            type: resp.catalog_vehicle_type.id,
            seriel_number: resp.serie_number,
            insurer_name: resp.insurer_name,
            insurance_policy_number: resp.insurance_policy_number,
          });
        }
      },
      (error) => {
        setSpinner(false);
      }
    );
  };

  const submitHandler = ({
    numberPlate,
    brand,
    model,
    year,
    type,
    seriel_number,
    insurance_policy_number,
    insurer_name,
  }) => {
    setBtnSpinner(true);
    let payload = {
      brand: brand,
      model: model,
      year: year,
      catalog_vehicle_type_id: type,
      serie_number: seriel_number,
      license_plate: numberPlate,
      insurer_name: insurer_name,
      insurance_policy_number: insurance_policy_number,
    };
    showError("");
    setErrorList([]);
    if (selectedVehicle) {
      updateVehicle(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload,
        selectedVehicle
      ).then(
        (response) => {
          setBtnSpinner(false);
          if (response.status === 200) {
            alertContainer({
              title: "Vehículo actualizado con éxito",
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
            error?.response?.data?.errors || [
              "Algo salió mal. Por favor, inténtelo de nuevo más tarde",
            ]
          );
        }
      );
    } else {
      saveVehicle(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        payload
      ).then(
        (response) => {
          setBtnSpinner(false);
          if (response.status === 201) {
            alertContainer({
              title: "El vehículo fue creado con éxito",
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
            error?.response?.data?.errors || [
              "Algo salió mal. Por favor, inténtelo de nuevo más tarde",
            ]
          );
        }
      );
    }
  };

  return (
    <Modal
      className="entityModalContainer"
      title={selectedVehicle ? "Actualizar Vehiculo" : "Nuevo Vehiculo"}
      visible={visible}
      data-testid="create-vehicle-modal"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      {spinner ? (
        <div data-testid="modal-spinner" className="text-center pt-4">
          <Spin indicator={antIcon} />
        </div>
      ) : (
        <Formik
          initialValues={data}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            numberPlate: Yup.string()
              .min(7, ErrorMessages.numberPlate_min)
              .max(20, ErrorMessages.numberPlate_max)
              .required(ErrorMessages.numberPlate_required),
            brand: Yup.string()
              .required(ErrorMessages.brand_required)
              .min(3, ErrorMessages.brand_min)
              .max(100, ErrorMessages.brand_max),
            model: Yup.string()
              .required(ErrorMessages.model_required)
              .min(3, ErrorMessages.model_min)
              .max(100, ErrorMessages.model_max),
            year: Yup.string()
              .required(ErrorMessages.year_required)
              .min(4, ErrorMessages.year_min_max)
              .max(4, ErrorMessages.year_min_max),
            type: Yup.string().required(ErrorMessages.type_required),
            seriel_number: Yup.string()
              .required(ErrorMessages.seriel_number_required)
              .min(17, ErrorMessages.seriel_number_min_max)
              .max(17, ErrorMessages.seriel_number_min_max),
            insurer_name: Yup.string()
              .required(ErrorMessages.insurer_name_required)
              .min(3, ErrorMessages.insurer_name_min)
              .max(100, ErrorMessages.insurer_name_max),
            insurance_policy_number: Yup.string()
              .required(ErrorMessages.insurance_policy_number_required)
              .min(3, ErrorMessages.insurance_policy_number_min)
              .max(20, ErrorMessages.insurance_policy_number_max),
          })}
          onSubmit={(
            {
              numberPlate,
              brand,
              model,
              year,
              type,
              seriel_number,
              insurance_policy_number,
              insurer_name,
            },
            { setStatus, setSubmitting }
          ) => {
            setStatus();
            submitHandler({
              numberPlate,
              brand,
              model,
              year,
              type,
              seriel_number,
              insurance_policy_number,
              insurer_name,
            });
          }}
          render={({
            values,
            errors,
            status,
            touched,
            handleChange,
            handleSubmit,
          }) => (
            <Form>
              <>
                <Row className="ant-row mb-3">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Placa<span className="red-color">*</span>
                      </Label>
                      <FormItem name="numberPlate" className="m-0">
                        <Field
                          name="numberPlate"
                          type="text"
                          autoComplete="off"
                          value={values.numberPlate}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Placa"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Numero de Identificacion Vehicular
                        <span className="red-color">*</span>
                      </Label>
                      <FormItem name="seriel_number" className="m-0">
                        <Field
                          name="seriel_number"
                          type="text"
                          value={values.seriel_number}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Identificacion Vehicular"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Marca<span className="red-color">*</span>
                      </Label>
                      <FormItem name="brand" className="m-0">
                        <Field
                          name="brand"
                          type="text"
                          value={values.brand}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Marca"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Modelo<span className="red-color">*</span>
                      </Label>
                      <FormItem name="model" className="m-0">
                        <Field
                          name="model"
                          type="text"
                          value={values.model}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Modelo"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Ano<span className="red-color">*</span>
                      </Label>
                      <FormItem name="year" className="m-0">
                        <Field
                          name="year"
                          type="number"
                          value={values.year}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Ano"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Nombre Aseguradora<span className="red-color">*</span>
                      </Label>
                      <FormItem name="insurer_name" className="m-0">
                        <Field
                          name="insurer_name"
                          type="text"
                          value={values.insurer_name}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Nombre Aseguradora"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Numero de Poliza<span className="red-color">*</span>
                      </Label>
                      <FormItem name="insurance_policy_number" className="m-0">
                        <Field
                          name="insurance_policy_number"
                          type="text"
                          value={values.insurance_policy_number}
                          onChange={handleChange}
                          className={"form-control"}
                          placeholder="Ingrese Numero de Poliza"
                        />
                      </FormItem>
                    </FormGroup>
                  </div>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
                    <FormGroup>
                      <Label className="form-label">
                        Tipo<span className="red-color">*</span>
                      </Label>
                      <FormItem name="type" className="m-0">
                        <Select
                          name="type"
                          className={"form-control p-0"}
                          value={values.type}
                          onChange={handleChange}
                        >
                          {typeOptions.map((item, index) => {
                            return (
                              <Select.Option key={index} value={item.id}>
                                {item.code + " - " + item.name}
                              </Select.Option>
                            );
                          })}
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
                        <input
                          key="back"
                          className="entityBtn"
                          data-testid="vehicle-button"
                          type="submit"
                          onClick={handleSubmit}
                          value={btnValue}
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

export default VehicleModal;
