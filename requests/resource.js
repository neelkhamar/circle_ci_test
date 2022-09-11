import server from "../apis/server";

export const getPremiumResources = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/premium_resources`);
};

export const getPremiumResourceById = async (
  accessToken,
  uid,
  client,
  resourceId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/premium_resources/${resourceId}`);
};

export const createPremiumResource = async (
  accessToken,
  uid,
  client,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/premium_resources`, payload);
};

export const updatePremiumResourceById = async (
  accessToken,
  uid,
  client,
  payload,
  resourceId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/premium_resources/${resourceId}`,
    payload
  );
};

export const deletePremiumResourceById = async (
  accessToken,
  uid,
  client,
  resourceId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/premium_resources/${resourceId}`);
};
