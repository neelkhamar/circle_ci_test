import server from "../apis/server";

export const getDropdownOptions = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/freights/catalogs`);
};

export const uploadProducts = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(
    `api/v1/premium/freight_goods/importation_invoice_reader`,
    payload
  );
};

export const fetchDistance = async (
  accessToken,
  uid,
  client,
  origin_lat,
  origin_lng,
  dest_lat,
  dest_lng
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/externals/google_distance?origin_lat=${origin_lat}&origin_lng=${origin_lng}&dest_lat=${dest_lat}&dest_lng=${dest_lng}`
  );
};

export const getAllFlete = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/freights`);
};

export const createFlete = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/freights`, payload);
};

export const deleteFleteById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/freights/${id}`);
};

export const getFleteById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/freights/${id}`);
};

export const updateFleteById = async (
  accessToken,
  uid,
  client,
  id,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/freights/${id}`, payload);
};

export const cloneFleteById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/freights/${id}/clone`);
};

export const downloadFleteById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
    bufferResponse: true,
  };
  return await server(options).get(`api/v1/freights/${id}/download`);
};

export const downloadExcelFile = async (accessToken, uid, client, required) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
    bufferResponse: true,
  };
  let url = `api/v1/freight_goods/download`;
  if (required) {
    url = url + "?required_params=true";
  }
  return await server(options).get(url);
};

export const uploadGoodsFile = async (
  accessToken,
  uid,
  client,
  payload,
  modal
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  let url = "api/v1/freight_goods/";
  if (modal === 2) {
    url = url + "upload_xml";
  } else {
    url = url + "upload_xlsx";
  }
  return await server(options).post(url, payload);
};
