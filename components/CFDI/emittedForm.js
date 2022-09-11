import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import {
  Button,
  FormGroup,
  Label,
  // Col,
  Row,
  Spinner,
} from "reactstrap";
import * as Yup from "yup";

function EmittedForm({
  getEmitterData,
  spinner,
  selectedEmitter,
  redirectCFDI,
}) {
  const statusOption = [
    {
      key: "Cualquiera",
      value: "any",
    },
    {
      key: "Cancelados",
      value: "cancel",
    },
    {
      key: "Validos",
      value: "valid",
    },
  ];

  return (
    <Formik
      initialValues={{
        startDate: "",
        endDate: "",
        statusEmitted: "any",
        actionEmitted: "list",
      }}
      validationSchema={Yup.object().shape({
        startDate: Yup.string().required("Required"),
        endDate: Yup.string().required("Required"),
        statusEmitted: Yup.string().required("Required"),
        actionEmitted: Yup.string().required("Required"),
      })}
      onSubmit={(
        { startDate, endDate, statusEmitted, actionEmitted },
        { setStatus, setSubmitting }
      ) => {
        setStatus();
        getEmitterData(startDate, endDate, statusEmitted, "list");
      }}
      render={({
        values,
        errors,
        status,
        touched,
        handleChange,
        handleSubmit,
        handleBlur,
      }) => (
        <Form>
          <>
            <Row className="mt-3 ant-row">
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Dia de Inicio<span className="red-color">*</span>
                  </Label>
                  <div className="d-flex">
                    <Field
                      name="startDate"
                      type="date"
                      autoComplete="off"
                      onChange={handleChange}
                      value={values.startDate}
                      className={
                        "form-control" +
                        (errors.startDate && touched.startDate
                          ? " is-invalid"
                          : "")
                      }
                      placeholder="Select Date"
                    />
                  </div>
                  {errors.startDate && touched.startDate && (
                    <div className="invalid-feedback d-block">
                      {errors.startDate}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Dia Final<span className="red-color">*</span>
                  </Label>
                  <div className="d-flex">
                    <Field
                      name="endDate"
                      type="date"
                      autoComplete="off"
                      onChange={handleChange}
                      value={values.endDate}
                      className={
                        "form-control" +
                        (errors.endDate && touched.endDate ? " is-invalid" : "")
                      }
                      placeholder="Select Date"
                    />
                  </div>
                  {errors.endDate && touched.endDate && (
                    <div className="invalid-feedback d-block">
                      {errors.endDate}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Estado<span className="red-color">*</span>
                  </Label>
                  <FormItem name="statusEmitted">
                    <Select
                      name="statusEmitted"
                      onBlur={handleBlur}
                      placeholder="Status Emitted"
                      className={"form-control p-0"}
                      value={values.statusEmitted}
                      onChange={handleChange}
                    >
                      {statusOption.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.value}>
                            {item.key}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </FormGroup>
              </div>
            </Row>
            <Row className="mt-4 d-flex justify-content-between">
              <div className="ant-col ant-col-xs-24 ant-col-xl-3">
                {spinner ? (
                  <Button className="searchBtnDuplicate" disabled={true}>
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
                    className="searchBtn"
                    type="submit"
                    value="Buscar"
                  />
                )}
              </div>
              {selectedEmitter ? (
                <div className="ant-col ant-col-xs-24 ant-col-xl-3">
                  <input
                    key="back"
                    className="searchBtn"
                    onClick={() => redirectCFDI(selectedEmitter)}
                    type="button"
                    value="Crear Carta Porte"
                  />
                </div>
              ) : (
                <></>
              )}
            </Row>
          </>
        </Form>
      )}
    />
  );
}

export default EmittedForm;
