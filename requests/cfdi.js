import server from "../apis/server";

export const getReceivedData = async (
  client,
  accessToken,
  uid,
  sessionVal,
  status,
  action,
  year,
  month
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/cfdis/received?session_key=${sessionVal}&status=${status}&action_sat=${action}&year=${year}&month=${month}`
  );
};

export const getEmittedData = async (
  client,
  accessToken,
  uid,
  sessionVal,
  status,
  action,
  start,
  end
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/cfdis/emitted?session_key=${sessionVal}&status=${status}&action_sat=${action}&date_start=${start}&date_end=${end}`
  );
};

export const getCFDIData = async (accessToken, client, uid) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/users/company`);
};

export const getCFDIOptions = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/cfdis/catalogs`);
};

export const createIngresoTranslado = async (
  accessToken,
  uid,
  client,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/cfdis`, payload);
};

export const getAllCDFI = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/cfdis`);
};

export const cancelCFDI = async (accessToken, uid, client, id, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  let url = `api/v1/cfdis/${id}/cancel?motive=${payload.motive}`;
  if (payload.substitution) {
    url = url + `&substitution=${payload.substitution}`;
  }
  return await server(options).delete(url);
};

export const downlodCFDI = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
    bufferResponse: true,
  };
  return await server(options).get(`api/v1/cfdis/${id}/download`);
};
