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

function ReceiverForm({
  getReceiverData,
  spinner,
  selectedReceiver,
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
        year: "",
        month: "",
        statusReceived: "any",
        actionEmitted: "list",
      }}
      validationSchema={Yup.object().shape({
        year: Yup.string()
          .max(4, "4 digit value is required")
          .min(4, "4 digit value is required")
          .required("Required"),
        month: Yup.string()
          .max(2, "2 digit value is required")
          .min(1, "2 digit value is required")
          .required("Required"),
        statusReceived: Yup.string().required("Required"),
        actionEmitted: Yup.string().required("Required"),
      })}
      onSubmit={(
        { year, month, statusReceived, actionEmitted },
        { setStatus, setSubmitting }
      ) => {
        setStatus();
        getReceiverData(year, month, statusReceived, "list");
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
                    Año<span className="red-color">*</span>
                  </Label>
                  <FormItem name="year">
                    <Field
                      name="year"
                      type="number"
                      autoComplete="off"
                      className={"form-control"}
                      placeholder="Year"
                      value={values.year}
                      onChange={handleChange}
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Mes<span className="red-color">*</span>
                  </Label>
                  <FormItem name="month">
                    <Field
                      name="month"
                      type="number"
                      autoComplete="off"
                      className={"form-control"}
                      placeholder="Month"
                      value={values.month}
                      onChange={handleChange}
                    />
                  </FormItem>
                </FormGroup>
              </div>
              <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-2">
                <FormGroup>
                  <Label className="form-label">
                    Estado<span className="red-color">*</span>
                  </Label>
                  <FormItem name="statusReceived">
                    <Select
                      name="statusReceived"
                      onBlur={handleBlur}
                      placeholder="Status Received"
                      className={"form-control p-0"}
                      value={values.statusReceived}
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
              {selectedReceiver ? (
                <div className="ant-col ant-col-xs-24 ant-col-xl-3">
                  <input
                    key="back"
                    className="searchBtn"
                    type="button"
                    onClick={() => redirectCFDI(selectedReceiver)}
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

export default ReceiverForm;
