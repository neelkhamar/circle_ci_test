import server from "../apis/server";

export const getCompanyDetailById = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/users/company`);
};

export const rfcValidate = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(
    `api/v1/sat_authentications/setup`,
    payload
  );
};

export const fetchSessionValue = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(
    `api/v1/sat_authentications/login`,
    payload
  );
};

export const updateCompanyDetails = async (
  accessToken,
  uid,
  client,
  id,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/companies/${id}`, payload);
};

export const uploadCertificates = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/companies/upload_certs`, payload);
};

export const uploadProfileImage = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/companies/upload_logo`, payload);
};
