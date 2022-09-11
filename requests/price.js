import server from "../apis/server";

export const getAllPrices = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/prices`);
};

export const getPriceById = async (accessToken, uid, client, priceId) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/prices/${priceId}`);
};

export const updatePrice = async (
  accessToken,
  uid,
  client,
  payload,
  priceId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/prices/${priceId}`, payload);
};

export const createPrice = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/prices`, payload);
};
