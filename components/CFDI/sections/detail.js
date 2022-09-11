import { Field, Form, Formik } from "formik";
import { FormGroup, Label, Row } from "reactstrap";

function Detail({ data, selectedCartaPorte }) {
  return (
    <>
      <Formik
        initialValues={{
          name: data?.info.name,
          type: data?.additional_attributes[0].attribute,
          rfc: data?.info.rfc,
          effect: selectedCartaPorte?.effect,
          emittedDate: selectedCartaPorte?.emitted_date,
          address: `${data?.location.address} ${data?.location.colony} ${data?.location.locality} ${data?.location.zip_code}`,
        }}
        enableReinitialize={true}
        onSubmit={({}, { setStatus, setSubmitting }) => {
          setStatus();
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
              <Row className="p-3 pb-4 ant-row">
                <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                  <FormGroup>
                    <Label className="form-label">Razon Social</Label>
                    <div className="d-flex">
                      <Field
                        name="name"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.name}
                        className={
                          "form-control" +
                          (errors.name && touched.name ? " is-invalid" : "")
                        }
                        placeholder="Enter Name"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                  <FormGroup>
                    <Label className="form-label">Tipo</Label>
                    <div className="d-flex">
                      <Field
                        name="type"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.type}
                        className={
                          "form-control" +
                          (errors.type && touched.type ? " is-invalid" : "")
                        }
                        placeholder="Enter Type"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">RFC</Label>
                    <div className="d-flex">
                      <Field
                        name="rfc"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.rfc}
                        className={
                          "form-control" +
                          (errors.rfc && touched.rfc ? " is-invalid" : "")
                        }
                        placeholder="Enter RFC"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">Tipo de Comprobante</Label>
                    <div className="d-flex">
                      <Field
                        name="effect"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.effect}
                        className={
                          "form-control" +
                          (errors.effect && touched.effect ? " is-invalid" : "")
                        }
                        placeholder="Enter Effect"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">Fecha</Label>
                    <div className="d-flex">
                      <Field
                        name="emittedDate"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.emittedDate}
                        className={
                          "form-control" +
                          (errors.emittedDate && touched.emittedDate
                            ? " is-invalid"
                            : "")
                        }
                        placeholder="Select Emitted Date"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
                  <FormGroup>
                    <Label className="form-label">Domicilio</Label>
                    <div className="d-flex">
                      <Field
                        name="address"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.address}
                        placeholder="Domicilio"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
              </Row>
            </>
          </Form>
        )}
      />
    </>
  );
}

export default Detail;
