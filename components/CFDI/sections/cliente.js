import { Field, Form, Formik } from "formik";
// import * as Yup from "yup";
import {
  FormGroup,
  Label,
  // Col,
  Row,
} from "reactstrap";

function Cliente({ data, selectedCartaPorte }) {
  return (
    <>
      <Formik
        initialValues={{
          Cliente: selectedCartaPorte?.emitter_reason,
          Uso_de_CFDI: "G03 - Gastos en general",
          Domicilio: "Carretera A Villa de Garcia Km. No. 4.5",
          Postal: "66350",
          Ciudad: "Ciudad Santa Catarina",
          Municipio: "Santa Catarina",
          Estado: "Nuevo León",
          País: "México",
          rfc: selectedCartaPorte.emitter_rfc,
          Teléfono: "",
          Moneda: "USD - Dolar americano",
          tc: "20.8922",
          Residencia_Fiscal: "",
          Registro: "",
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
                    <Label className="form-label">Cliente</Label>
                    <div className="d-flex">
                      <Field
                        name="Cliente"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Cliente}
                        className={"form-control"}
                        placeholder="Enter Cliente"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                  <FormGroup>
                    <Label className="form-label">Uso de CFDI</Label>
                    <div className="d-flex">
                      <Field
                        name="Uso_de_CFDI"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Uso_de_CFDI}
                        className={"form-control"}
                        placeholder="Enter Uso de CFDI"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-16 mt-2">
                  <FormGroup>
                    <Label className="form-label">Domicilio</Label>
                    <div className="d-flex">
                      <Field
                        name="Domicilio"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Domicilio}
                        className={"form-control"}
                        placeholder="Enter Domicilio"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">Código Postal</Label>
                    <div className="d-flex">
                      <Field
                        name="Postal"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Postal}
                        className={"form-control"}
                        placeholder="Enter Código Postal"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">Ciudad</Label>
                    <div className="d-flex">
                      <Field
                        name="Ciudad"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Ciudad}
                        className={"form-control"}
                        placeholder="Enter Ciudad"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">Municipio</Label>
                    <div className="d-flex">
                      <Field
                        name="Municipio"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Municipio}
                        placeholder="Enter Municipio"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
                  <FormGroup>
                    <Label className="form-label">Estado</Label>
                    <div className="d-flex">
                      <Field
                        name="Estado"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Estado}
                        placeholder="Enter Estado"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>

                <div className="ant-col ant-col-xs-24 ant-col-xl-5 mt-2">
                  <FormGroup>
                    <Label className="form-label">País</Label>
                    <div className="d-flex">
                      <Field
                        name="País"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.País}
                        placeholder="Enter País"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-5 mt-2">
                  <FormGroup>
                    <Label className="form-label">R.F.C</Label>
                    <div className="d-flex">
                      <Field
                        name="rfc"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.rfc}
                        placeholder="Enter RFC"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-5 mt-2">
                  <FormGroup>
                    <Label className="form-label">Teléfono</Label>
                    <div className="d-flex">
                      <Field
                        name="Teléfono"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Teléfono}
                        placeholder="Enter Teléfono"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-5 mt-2">
                  <FormGroup>
                    <Label className="form-label">Moneda</Label>
                    <div className="d-flex">
                      <Field
                        name="Moneda"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Moneda}
                        placeholder="Enter Moneda"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-4 mt-2">
                  <FormGroup>
                    <Label className="form-label">T.C</Label>
                    <div className="d-flex">
                      <Field
                        name="tc"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.tc}
                        placeholder="Enter T.C"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                  <FormGroup>
                    <Label className="form-label">Residencia Fiscal</Label>
                    <div className="d-flex">
                      <Field
                        name="Residencia_Fiscal"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Residencia_Fiscal}
                        placeholder="Enter Residencia Fiscal"
                        className="form-control"
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
                  <FormGroup>
                    <Label className="form-label">
                      Registro Identidad Fiscal del Receptor Extranjero
                    </Label>
                    <div className="d-flex">
                      <Field
                        name="Registro"
                        type="text"
                        autoComplete="off"
                        readOnly
                        onChange={handleChange}
                        value={values.Registro}
                        placeholder="Enter Registro Identidad Fiscal del Receptor Extranjero"
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

export default Cliente;
