import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Switch } from "antd";
import { Field, FormItem, Select } from "formik-antd";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { CountryData } from "../../Data/countries";
import SearchForm from "../../searchForm";

const scriptOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_Google_API_Key,
  libraries: ["places"],
};

const AddressForm = ({
  location,
  setLocation,
  resetValues,
  setErrorList,
  values,
  handleChange,
  handleBlur,
  countryOption,
  stateOption,
  cityOption,
  colonyOption,
  postalCodeOption,
  getSelectOptions,
  selectedFigure,
}) => {
  const { isLoaded, loadError } = useLoadScript(scriptOptions);
  const containerStyle = {
    width: "100%",
    height: "300px",
  };

  const inputHandler = (key, value) => {
    setLocation({
      ...location,
      [key]: value,
    });
  };

  const getEmoji = (code) => {
    if (code) {
      return CountryData[code] ? CountryData[code].emoji : "";
    }
  };

  return (
    <>
      <Row className="ant-row">
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2 mb-3 d-flex">
          <Switch
            checked={location.isManual}
            className="mr-3"
            disabled={selectedFigure}
            onChange={(val) => {
              setErrorList([]);
              setLocation({
                ...values,
                lat: "",
                lng: "",
                selected: false,
                address: "",
                country: "",
                state: "",
                city: "",
                colony: "",
                postalCode: "",
                street: "",
                insideNumber: "",
                outsideNumber: "",
                street1: "",
                insideNumber1: "",
                outsideNumber1: "",
                disableOutsideNumber: false,
                isManual: val,
              });
            }}
          />
          <h5>Ingresar manualmente</h5>
        </div>
        {!location.isManual ? (
          <>
            <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Address <span className="red-color">*</span>
                  </Label>
                  <SearchForm
                    location={location}
                    errorList={[]}
                    isLoaded={isLoaded}
                    loadError={loadError}
                    setLocation={setLocation}
                    values={values}
                    containerStyle={containerStyle}
                    resetValues={resetValues}
                  />
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Calle<span className="red-color">*</span>
                  </Label>
                  <FormItem name="street1">
                    <Field
                      name="street1"
                      type="text"
                      className={"form-control"}
                      placeholder="Calle"
                      disabled={true}
                      value={values.street1}
                      onChange={handleChange}
                    />
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">Número interior</Label>
                  <FormItem name="insideNumber1">
                    <Field
                      name="insideNumber1"
                      type="text"
                      className={"form-control"}
                      placeholder="Número interior"
                      value={values.insideNumber1}
                      onChange={(e) =>
                        inputHandler("insideNumber1", e.target.value)
                      }
                    />
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Número externo<span className="red-color">*</span>
                  </Label>
                  <FormItem name="outsideNumber1">
                    <Field
                      name="outsideNumber1"
                      type="text"
                      disabled={location.disableOutsideNumber}
                      className={"form-control"}
                      placeholder="Número externo"
                      value={values.outsideNumber1}
                      onChange={(e) =>
                        inputHandler("outsideNumber1", e.target.value)
                      }
                    />
                  </FormItem>
                </div>
              </FormGroup>
            </div>
          </>
        ) : (
          <>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Pais<span className="red-color">*</span>
                  </Label>
                  <FormItem name="country">
                    <Select
                      showSearch
                      name="country"
                      onBlur={handleBlur}
                      placeholder="Pais"
                      className={"form-control p-0"}
                      value={values.country}
                      onChange={(e) => {
                        setLocation({
                          ...values,
                          country: e,
                          state: "",
                          city: "",
                          postalCode: "",
                          colony: "",
                          isValidated: false,
                          lat: "",
                          lng: "",
                        });
                        getSelectOptions("state", e);
                      }}
                      filterOption={(input, option) => {
                        let str = "";
                        option.children.map((item) => {
                          str = str + item;
                        });
                        return (
                          str.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {countryOption.map((item, index) => {
                        return (
                          <Select.Option value={item.id} key={index}>
                            {getEmoji(item.code2)} ({item.code}) - {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Estado<span className="red-color">*</span>
                  </Label>
                  <FormItem name="state">
                    <Select
                      showSearch
                      name="state"
                      onBlur={handleBlur}
                      placeholder="Estado"
                      disabled={!values.country}
                      className={"form-control p-0"}
                      value={values.state}
                      onChange={(e) => {
                        setLocation({
                          ...values,
                          state: e,
                          city: "",
                          postalCode: "",
                          colony: "",
                          isValidated: false,
                          lat: "",
                          lng: "",
                        });
                        getSelectOptions("city", e);
                      }}
                      filterOption={(input, option) => {
                        let str = "";
                        option.children.map((item) => {
                          str = str + item;
                        });
                        return (
                          str.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {stateOption.map((item, index) => {
                        return (
                          <Select.Option value={item.id} key={index}>
                            ({item.code}) - {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2 width33">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Ciudad<span className="red-color">*</span>
                  </Label>
                  <FormItem name="city">
                    <Select
                      showSearch
                      name="city"
                      onBlur={handleBlur}
                      placeholder="Ciudad"
                      disabled={!values.state}
                      className={"form-control p-0"}
                      value={values.city}
                      onChange={(e) => {
                        setLocation({
                          ...values,
                          city: e,
                          postalCode: "",
                          colony: "",
                          isValidated: false,
                          lat: "",
                          lng: "",
                        });
                        getSelectOptions("postalCode", e);
                      }}
                      filterOption={(input, option) => {
                        let str = "";
                        option.children.map((item) => {
                          str = str + item;
                        });
                        return (
                          str.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {cityOption.map((item, index) => {
                        return (
                          <Select.Option value={item.id} key={index}>
                            ({item.code}) - {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Código postal<span className="red-color">*</span>
                  </Label>
                  <FormItem name="postalCode">
                    <Select
                      showSearch
                      name="postalCode"
                      onBlur={handleBlur}
                      placeholder="Código postal"
                      disabled={!values.city}
                      className={"form-control p-0"}
                      value={values.postalCode}
                      onChange={(e) => {
                        setLocation({
                          ...values,
                          postalCode: e,
                          colony: "",
                          isValidated: false,
                          lat: "",
                          lng: "",
                        });
                        getSelectOptions("colony", e);
                      }}
                      filterOption={(input, option) => {
                        return (
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {postalCodeOption.map((item, index) => {
                        return (
                          <Select.Option value={item.id} key={index}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-12 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Colonia<span className="red-color">*</span>
                  </Label>
                  <FormItem name="colony">
                    <Select
                      showSearch
                      name="colony"
                      onBlur={handleBlur}
                      placeholder="Colonia"
                      disabled={!values.postalCode}
                      className={"form-control p-0"}
                      value={values.colony}
                      onChange={(e) => {
                        setLocation({
                          ...values,
                          colony: e,
                        });
                      }}
                      filterOption={(input, option) => {
                        return (
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {colonyOption.map((item, index) => {
                        return (
                          <Select.Option
                            value={`${item.id}/${item.name}`}
                            key={index}
                          >
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Calle<span className="red-color">*</span>
                  </Label>
                  <FormItem name="street">
                    <Field
                      name="street"
                      type="text"
                      className={"form-control"}
                      placeholder="Calle"
                      value={values.street}
                      onChange={(e) => inputHandler("street", e.target.value)}
                    />
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">Número interior</Label>
                  <FormItem name="insideNumber">
                    <Field
                      name="insideNumber"
                      type="text"
                      className={"form-control"}
                      placeholder="Número interior"
                      value={values.insideNumber}
                      onChange={(e) =>
                        inputHandler("insideNumber", e.target.value)
                      }
                    />
                  </FormItem>
                </div>
              </FormGroup>
            </div>
            <div className="ant-col ant-col-xs-24 ant-col-xl-8 mt-2">
              <FormGroup>
                <div>
                  <Label className="form-label">
                    Número externo<span className="red-color">*</span>
                  </Label>
                  <FormItem name="outsideNumber">
                    <Field
                      name="outsideNumber"
                      type="text"
                      className={"form-control"}
                      placeholder="Número externo"
                      value={values.outsideNumber}
                      onChange={(e) =>
                        inputHandler("outsideNumber", e.target.value)
                      }
                    />
                  </FormItem>
                </div>
              </FormGroup>
            </div>
          </>
        )}
      </Row>
      {location.lat && location.lng ? (
        <Row>
          {location.isManual ? (
            <Col md={24}>
              <small>
                <b>NOTE:</b> Move the marker to set the location.
              </small>
            </Col>
          ) : null}
          <Col md={24}>
            <div className="mt-4">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: location.lat,
                  lng: location.lng,
                }}
                zoom={15}
              >
                <Marker
                  draggable={location.isManual}
                  onDragEnd={(e) => {
                    if (e) {
                      setLocation({
                        ...values,
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                      });
                    }
                  }}
                  position={{
                    lat: location.lat,
                    lng: location.lng,
                  }}
                />
              </GoogleMap>
            </div>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default AddressForm;
