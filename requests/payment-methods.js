import server from "../apis/server";

export const getPaymentCards = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/payment_methods`);
};

export const createPaymentCard = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/cards`, payload);
};

export const updatePaymentCardById = async (
  accessToken,
  uid,
  client,
  payload,
  cardId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/cards/${cardId}`, payload);
};

export const deletePaymentCard = async (accessToken, uid, client, cardId) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/cards/${cardId}`);
};
