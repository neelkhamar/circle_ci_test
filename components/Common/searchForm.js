import React, { useEffect, useRef, useState } from "react";
import {
  useLoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { Input } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  fetchLocationDetail,
  getColonyDetail,
  getPlaceDetail,
} from "../../requests/carta-porte";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

export default function SearchForm({
  location,
  setLocation,
  isLoaded,
  loadError,
  disabled,
  values,
}) {
  const [autocomplete, setAutocomplete] = useState(null);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const inputEl = useRef(null);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  useEffect(() => {
    if (location.address) {
      setKeyword(location.address);
    }
  }, [location.address]);

  // Handle the keypress for input
  const onKeypress = (e) => {
    // On enter pressed
    if (e.key === "Enter") {
      e.preventDefault();
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onLoad = (autocompleteObj) => {
    setAutocomplete(autocompleteObj);
  };

  const getColonyData = async (code, colony) => {
    return await getColonyDetail(
      currentUser.accessToken,
      currentUser.uid,
      currentUser.client,
      code,
      colony
    );
  };

  const onPlaceChanged = (event) => {
    if (autocomplete) {
      setError("");
      const place = autocomplete.getPlace();
      if ("place_id" in place) {
        setBtnSpinner(true);
        getPlaceDetail(
          currentUser.accessToken,
          currentUser.uid,
          currentUser.client,
          place.place_id
        ).then(
          async (response) => {
            setBtnSpinner(false);
            let colony = "";
            let postalCode = "";
            let st = "";
            let st_number = "";
            response.data.data.address_components.map((item) => {
              if (item.types.includes("postal_code")) {
                postalCode = item.long_name;
              }
              if (item.types.includes("sublocality_level_1")) {
                colony = item.long_name;
              }
              if (item.types.includes("street_number")) {
                st_number = item.long_name;
              }
              if (item.types.includes("route")) {
                st = item.long_name;
              }
            });
            if (colony && postalCode && st) {
              setBtnSpinner(true);
              try {
                let colonyData = await getColonyData(postalCode, colony);
                setBtnSpinner(false);
                if (colonyData.status === 200) {
                  let val = values ? { ...values } : { ...location };
                  setLocation({
                    ...val,
                    colony: colonyData.data.data.id,
                    street1: st,
                    outsideNumber1: st_number,
                    address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    selected: true,
                    disableOutsideNumber: st_number ? true : false,
                  });
                  setKeyword(place.formatted_address);
                }
              } catch (err) {
                setBtnSpinner(false);
                clear(event);
                setError(
                  "Seleccione una dirección que contenga colonia, calle y código postal"
                );
              }
            } else {
              clear(event);
              setError(
                "Seleccione una dirección que contenga colonia, calle y código postal"
              );
            }
          },
          (error) => {
            setBtnSpinner(false);
            clear(event);
          }
        );
      }
    }
  };

  const clear = (e) => {
    if (!disabled) {
      if (values) {
        setLocation({
          ...values,
          colony: "",
          address: "",
          lat: "",
          lng: "",
          selected: false,
          disableOutsideNumber: false,
          street1: "",
          outsideNumber1: "",
        });
      } else {
        setLocation({
          ...location,
          colony: "",
          address: "",
          lat: "",
          lng: "",
          selected: false,
          disableOutsideNumber: false,
          street1: "",
          outsideNumber1: "",
        });
      }
      setKeyword("");
    }
  };

  return (
    <>
      {loadError && (
        <div>Google Map script can't be loaded, please reload the page</div>
      )}

      {isLoaded && (
        <React.Fragment>
          <div className="mb-3 d-flex">
            <div className="w-full">
              <Autocomplete
                onLoad={onLoad}
                disabled={disabled}
                fields={[
                  "place_id",
                  "adr_address",
                  "geometry.location",
                  "formatted_address",
                ]}
                onPlaceChanged={onPlaceChanged}
              >
                <Input
                  placeholder="Type something here"
                  value={keyword}
                  disabled={disabled}
                  ref={inputEl}
                  readOnly={location.selected}
                  suffix={
                    location.selected ? (
                      <FeatherIcon
                        icon="x"
                        size={17}
                        className="autocomplete-google"
                        onClick={clear}
                      />
                    ) : (
                      <></>
                    )
                  }
                  onChange={(e) => {
                    setKeyword(e.target.value);
                  }}
                  onKeyPress={onKeypress}
                  className="searchBox"
                />
              </Autocomplete>
            </div>
            {btnSpinner ? (
              <div className="p-2 pl-3">
                <LoadingOutlined style={{ fontSize: 20, color: "blue" }} spin />
              </div>
            ) : null}
          </div>
          {error && <div className={"alert alert-danger"}>{error}</div>}
          {/* {
            (errorList.length > 0 && errorList.map((err, index) => {
                return (
                    <div key={index} className={"alert alert-danger"}>{err}</div>
                )
            }))
          } */}
        </React.Fragment>
      )}
    </>
  );
}
