import { useSelector } from "react-redux";
import server from "../apis/server";

// const { currentUser } = useSelector((state) => {
//   return {
//     currentUser: state.auth.currentUser,
//   };
// });

export const getCurp = async (curp, accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/externals/curp?curp=${curp}`);
};

export const validateRFCValue = async (accessToken, uid, client, rfc) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/externals/rfc_valid?rfc=${rfc}`);
};

export const getAllFigures = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/figures`);
};

export const deleteFigure = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/figures/${id}`);
};

export const saveFigure = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/figures`, payload);
};

export const getFigureById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/figures/${id}`);
};

export const updateFigure = async (accessToken, uid, client, payload, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/figures/${id}`, payload);
};

export const saveVehicle = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/vehicles`, payload);
};

export const updateVehicle = async (accessToken, uid, client, payload, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/vehicles/${id}`, payload);
};

export const getVehicles = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/vehicles`);
};

export const getVehicleById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/vehicles/${id}`);
};

export const getVehicleOption = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/vehicles/types`);
};

export const deleteVehicle = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/vehicles/${id}`);
};

export const fetchAddress = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/locations`);
};

export const deleteLocation = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/locations/${id}`);
};

export const saveAddress = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/locations`, payload);
};

export const getPlaceDetail = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/externals/google_place?place_id=${id}`
  );
};

export const getColonyDetail = async (
  accessToken,
  uid,
  client,
  postalCode,
  colony
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_colonies/find?postal_code=${postalCode}&name=${colony}`
  );
};

export const getLocationById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/locations/${id}`);
};

export const getLatLong = async (accessToken, uid, client, address) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/externals/google_address?address=${address}`
  );
};

export const getCountryList = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalog_countries`);
};

export const getStateList = async (accessToken, uid, client, country_id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_countries/${country_id}/states`
  );
};

export const getCityList = async (accessToken, uid, client, state_id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_states/${state_id}/municipalities`
  );
};

export const getPostalCodeList = async (accessToken, uid, client, city_id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_municipalities/${city_id}/postal_codes`
  );
};

export const getColonyList = async (accessToken, uid, client, postcode) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_postal_codes/${postcode}/colonies`
  );
};

export const updateLocation = async (accessToken, uid, client, payload, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/locations/${id}`, payload);
};

export const getSCTList = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/sct_types`);
};

export const getSctTypes = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalogs/sct_types`);
};

export const createSCT = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/sct_types`, payload);
};

export const getSCTById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/sct_types/${id}`);
};

export const updateSCT = async (accessToken, uid, client, payload, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/sct_types/${id}`, payload);
};

export const deleteSCTById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/sct_types/${id}`);
};

export const getPolicyList = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/insurance_policies`);
};

export const createPolicy = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/insurance_policies`, payload);
};

export const getPolicyById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/insurance_policies/${id}`);
};

export const updatePolicy = async (accessToken, uid, client, payload, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/insurance_policies/${id}`,
    payload
  );
};

export const deletePolicyById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/insurance_policies/${id}`);
};
