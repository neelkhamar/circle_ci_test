import server from "../apis/server";

export const getPlans = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/plans`);
};

export const getBenefits = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/plans/${id}/benefits`);
};

export const createBenefit = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/plan_benefits`, payload);
};

export const getBenefitById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/plan_benefits/${id}`);
};

export const updateBenefit = async (accessToken, uid, client, id, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/plan_benefits/${id}`, payload);
};

export const deleteBenefitById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/plan_benefits/${id}`);
};

export const getPlanById = async (accessToken, uid, client, planId) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/plans/${planId}`);
};

export const createPlan = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/plans`, payload);
};

export const updatePlanById = async (
  accessToken,
  uid,
  client,
  payload,
  planId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/plans/${planId}`, payload);
};

export const deletePlanById = async (accessToken, uid, client, planId) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/plans/${planId}`);
};

export const getLandingPlans = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/plans/landing`);
};
