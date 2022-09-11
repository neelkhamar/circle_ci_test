import { Modal } from "antd";
import { Field, Form, Formik } from "formik";
import { FormItem, Select } from "formik-antd";
import { Col, FormGroup, Label, Row } from "reactstrap";
import * as Yup from "yup";

const ReasonModal = ({ visible, handleCancel, handleOk }) => {
  const saveForm = (values) => {
    handleOk(values);
  };

  return (
    <Modal
      className="entityModalContainer"
      title={"Reason"}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      {
        <Formik
          initialValues={{}}
          enableReinitialize={true}
          validationSchema={() =>
            Yup.lazy((values) => {
              let validate = {
                motive: Yup.string().required("Se requiere la Motive"),
              };
              if (values.motive === "01") {
                validate["substitution"] = Yup.string().required(
                  "Se requiere la Substitution"
                );
              }
              return Yup.object().shape(validate);
            })
          }
          onSubmit={(values, { setStatus, setSubmitting }) => {
            setStatus();
            saveForm(values);
          }}
          render={({ values, handleChange, handleBlur }) => (
            <Form>
              <>
                <Row className="ant-row">
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                    <FormGroup>
                      <div>
                        <Label className="form-label">
                          Motive<span className="red-color">*</span>
                        </Label>
                        <FormItem name="motive">
                          <Select
                            name="motive"
                            onBlur={handleBlur}
                            placeholder="Motive"
                            className={"form-control p-0"}
                            value={values.motive}
                            onChange={handleChange}
                          >
                            <Select.Option value="01">
                              Comprobante emitido con errores con relacion
                            </Select.Option>
                            <Select.Option value="02">
                              Comprobante emitido con errores sin relacion
                            </Select.Option>
                            <Select.Option value="03">
                              No se llevo a cabo la operacion
                            </Select.Option>
                            <Select.Option value="04">
                              Operacion nominativa relacionada en la factura
                              global
                            </Select.Option>
                          </Select>
                        </FormItem>
                      </div>
                    </FormGroup>
                  </div>
                  {values.motive === "01" ? (
                    <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                      <FormGroup>
                        <div>
                          <Label className="form-label">
                            Substitution<span className="red-color">*</span>
                          </Label>
                          <FormItem name="substitution">
                            <Field
                              name="substitution"
                              type="text"
                              autoComplete="off"
                              className={"form-control"}
                              placeholder="Substitution"
                              value={values.substitution}
                              onChange={handleChange}
                            />
                          </FormItem>
                        </div>
                      </FormGroup>
                    </div>
                  ) : null}
                </Row>
                <Row className={"mb-2 mt-2"}>
                  <Col md={12}>
                    <FormGroup>
                      <input
                        key="back"
                        className="entityBtn"
                        type="submit"
                        value="Continue"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </>
            </Form>
          )}
        />
      }
    </Modal>
  );
};

export default ReasonModal;
