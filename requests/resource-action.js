import server from "../apis/server";

export const getPremiumResourceActionsByResource = async (
  accessToken,
  uid,
  client,
  resourceId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/premium_resources/${resourceId}/actions`
  );
};

export const getPremiumResourceActionById = async (
  accessToken,
  uid,
  client,
  resourceActionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/premium_resource_actions/${resourceActionId}`
  );
};

export const createPremiumResourceAction = async (
  accessToken,
  uid,
  client,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/premium_resource_actions`, payload);
};

export const updatePremiumResourceActionById = async (
  accessToken,
  uid,
  client,
  payload,
  resourceActionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/premium_resource_actions/${resourceActionId}`,
    payload
  );
};

export const deletePremiumResourceActionById = async (
  accessToken,
  uid,
  client,
  resourceActionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(
    `api/v1/premium_resource_actions/${resourceActionId}`
  );
};
