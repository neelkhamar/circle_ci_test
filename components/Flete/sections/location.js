import { DatePicker, Select } from "antd";
import FeatherIcon from "feather-icons-react";
import { Field } from "formik";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { FormGroup, Label, Row } from "reactstrap";
import { fetchDistance } from "../../../requests/flete";
import { Button } from "../../buttons/buttons";

const Location = ({
  locationList,
  setLocationList,
  locationOptions,
  locationError,
  currentUser,
}) => {
  const { Option } = Select;
  const [currentData, setCurrentData] = useState({
    location: "",
    type: "1",
    date: null,
    time: "",
    distance: "",
  });
  const [showError, setShowError] = useState(false);
  const [destSelected, setDestSelected] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [usedLocations, setUsedLocations] = useState([]);
  const locationTypes = [
    // {
    //     title: "Origen",
    //     value: "0"
    // },
    {
      title: "Destino",
      value: "3",
    },
    {
      title: "Intermedia",
      value: "2",
    },
  ];

  const resetData = () => {
    let obj = {
      location: "",
      type: "",
      date: "",
      time: "",
      distance: "",
    };
    setCurrentData(obj);
    setSelectedLocation(0);
  };

  const inputHandler = (key, value) => {
    setCurrentData({
      ...currentData,
      [key]: value,
    });
  };

  const addRow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowError(false);
    let keys = Object.keys(currentData);
    let valid = true;
    keys.map((item) => {
      if (currentData[item] === "") {
        valid = false;
      }
    });
    if (valid) {
      let list = [...locationList];
      let obj = { ...currentData };
      let used = [...usedLocations];
      used.push(obj.location);
      obj["id"] = Date.now();
      obj["new"] = true;
      list.push(obj);
      setLocationList(list);
      setUsedLocations(used);
      resetData();
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (locationList.length) {
      let dest = false;
      locationList.map((item) => {
        if (item.type === "3") {
          dest = true;
        }
      });
      if (dest) {
        setDestSelected(true);
      } else {
        setDestSelected(false);
      }
    }
  }, [locationList]);

  useEffect(() => {
    if (currentData.location && currentData.type !== "1") {
      let origin;
      let locationObj;
      if (currentData.id) {
        locationList.map((item, index) => {
          if (item.id === currentData.id) {
            locationObj = locationList[index - 1];
          }
        });
        origin = locationOptions.filter(
          (val) => val.id === locationObj.location
        );
      } else {
        locationObj = locationList[locationList.length - 1];
        origin = locationOptions.filter(
          (val) => val.id === locationObj.location
        );
      }
      let destination = locationOptions.filter(
        (val) => val.id === currentData.location
      );
      console.log(origin);
      if (origin.length > 0) {
        measureDistance(
          origin[0].latitude,
          origin[0].longitude,
          destination[0].latitude,
          destination[0].longitude,
          locationObj
        );
      }
    }
  }, [currentData.location]);

  const calculateDateTime = (date, time, extra) => {
    let d = moment(date).format("YYYY-MM-DD");
    let t = moment(time).format("HH:mm:ss");
    let finalDate = moment(`${d} ${t}`).add(extra, "seconds");
    return finalDate;
  };

  const measureDistance = (o_lat, o_lng, d_lat, d_lng, origin) => {
    fetchDistance(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      o_lat,
      o_lng,
      d_lat,
      d_lng
    ).then(
      (response) => {
        if (response.status === 200 && response.data.data) {
          let result = response.data.data;
          if (result.rows.length) {
            if (
              result.rows[0].elements.length &&
              result.rows[0].elements[0].status != "ZERO_RESULTS"
            ) {
              let d = { ...currentData };
              d["distance"] =
                result.rows[0].elements[0].distance.value / 1000 +
                parseInt(origin.distance);
              let dateTime = calculateDateTime(
                origin.date,
                origin.time,
                result.rows[0].elements[0].duration.value
              );
              d["date"] = dateTime;
              d["time"] = dateTime;
              setCurrentData(d);
            }
          }
        }
      },
      (error) => {
        console.log("Error Fetching Data");
      }
    );
  };

  const updateRow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let list = [];
    let used = [];

    locationList.map((item) => {
      if (item.id === currentData.id) {
        if (currentData.type === "1") {
          setDestSelected(true);
        } else {
          setDestSelected(false);
        }
        used.push(currentData.location);
        list.push(currentData);
      } else {
        used.push(item.location);
        list.push(item);
      }
    });
    setUsedLocations(used);
    setLocationList(list);
    resetData();
  };

  const editRow = (item) => {
    setSelectedLocation(item.id);
    setCurrentData(item);
  };

  const getLocationRow = (editable, item, index) => {
    return (
      <Fragment key={!editable ? index : ""}>
        <div
          className={`ant-col ant-col-xs-24 ant-col-xl-6 mt-3 locationSelectManual`}
        >
          <FormGroup>
            <Label className="form-label">
              Ubicacion<span className="red-color">*</span>
            </Label>
            <Select
              name="location"
              // onBlur={handleBlur}
              disabled={!editable}
              placeholder="Ubicacion"
              className={
                "form-control p-0" +
                (editable && showError && currentData.location === ""
                  ? " is-invalid"
                  : "")
              }
              value={editable ? currentData.location : item.location}
              onChange={(val) => inputHandler("location", val)}
            >
              {locationOptions.map((val, index) => {
                return (
                  <Select.Option
                    disabled={usedLocations.includes(val.id)}
                    value={val.id}
                    key={index}
                  >{`
                                        ${val.catalog_colony.name}, ${val.catalog_colony.catalog_postal_code.catalog_municipality.name}, 
                                        ${val.catalog_colony.catalog_postal_code.catalog_municipality.catalog_state.name}, ${val.catalog_colony.catalog_postal_code.catalog_municipality.catalog_state.catalog_country.name} 
                                    `}</Select.Option>
                );
              })}
            </Select>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-3">
          <FormGroup>
            <Label className="form-label">
              Tipo de Ubicacion<span className="red-color">*</span>
            </Label>
            <Select
              name="type"
              placeholder="Tipo de Ubicacion"
              disabled={
                !editable || currentData.type === "1" || item.type === "1"
              }
              className={
                "form-control p-0" +
                (editable && showError && currentData.type === ""
                  ? " is-invalid"
                  : "")
                // +
                // (locationError.required && !item.type
                // ? " is-invalid"
                // : "")
              }
              value={editable ? currentData.type : item.type}
              onChange={(val) => inputHandler("type", val)}
            >
              {currentData.type === "1" || item.type === "1" ? (
                <Select.Option value="1">Origen</Select.Option>
              ) : null}
              {locationTypes.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={index}>
                    {item.title}
                  </Select.Option>
                );
              })}
            </Select>
          </FormGroup>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-6 mt-3">
          <FormGroup>
            <Label className="form-label">
              Fecha Y Hora<span className="red-color">*</span>
            </Label>
            <div className="date-time-container">
              <DatePicker
                name="date"
                disabled={!editable || currentData.type !== "1"}
                className={
                  "form-control marginRight1" +
                  (editable && showError && currentData.date === ""
                    ? " is-invalid"
                    : "")
                }
                onChange={(e) => inputHandler("date", e)}
                value={editable ? currentData.date : item.date}
              />
              <DatePicker
                picker={"time"}
                disabled={!editable || currentData.type !== "1"}
                className={
                  "form-control marginLeft1" +
                  (editable && showError && currentData.time === ""
                    ? " is-invalid"
                    : "")
                }
                value={editable ? currentData.time : item.time}
                onChange={(e) => inputHandler("time", e)}
              />
            </div>
          </FormGroup>
        </div>
        <div
          className={`ant-col ant-col-xs-24 ant-col-xl-6 mt-3 ${
            editable && !selectedLocation ? "" : "d-flex"
          }`}
        >
          <FormGroup>
            <Label className="form-label">
              Distancia Recorrida KM<span className="red-color">*</span>
            </Label>
            <Field
              name="distance"
              type="text"
              disabled={!editable || currentData.type !== "1"}
              className={
                "form-control" +
                (editable && showError && currentData.distance === ""
                  ? " is-invalid"
                  : "")
              }
              value={editable ? currentData.distance : item.distance}
              onChange={(e) => inputHandler("distance", e.currentTarget.value)}
            />
          </FormGroup>
          {editable ? (
            <div>
              {selectedLocation === currentData.id ? (
                <>
                  <Label className="form-label opacity0">Action</Label>
                  <div
                    className="d-flex p-2 cursorPointer blueColor"
                    onClick={(e) => resetData()}
                  >
                    Cancel
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div>
              <Label className="form-label opacity0">Action</Label>
              <div className="p-2">
                <FeatherIcon
                  icon="edit"
                  onClick={(e) => editRow(item)}
                  size={15}
                />
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  return (
    <Row className="ant-row mt-4 card_container">
      <div className="ant-col ant-col-xs-24 ant-col-xl-24 mt-3">
        <span className="ant-page-header-heading-title">Ubicaciones</span>
      </div>
      {locationList.length > 0 &&
        locationList.map((item, index) => {
          if (selectedLocation && selectedLocation === item.id) {
            return getLocationRow(true, item, index);
          } else {
            return getLocationRow(false, item, index);
          }
        })}
      {!selectedLocation && !destSelected ? (
        <Row className="ant-row p-0 m-0">{getLocationRow(true, {}, "")}</Row>
      ) : null}
      {locationError.message ? (
        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
          <div className={"alert alert-danger m-0 mt-3"}>
            {locationError.message}
          </div>
        </div>
      ) : (
        <></>
      )}
      {!selectedLocation ? (
        <>
          {!destSelected && (
            <div className="ant-col ant-col-xs-24 ant-col-xl-24">
              <Button
                size="small"
                key="4"
                className="add_file_btn"
                onClick={addRow}
                type="primary"
              >
                Agregar
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="ant-col ant-col-xs-24 ant-col-xl-24">
          <Button
            size="small"
            key="4"
            className="add_file_btn"
            onClick={updateRow}
            type="primary"
          >
            Actualizar ubicación
          </Button>
        </div>
      )}
    </Row>
  );
};

export default React.memo(Location);
