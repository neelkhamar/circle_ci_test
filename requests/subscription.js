import server from "../apis/server";

export const getSubscription = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/subscriptions`);
};

export const getAllPaymentDetails = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/subscriptions/settings`);
};

export const applySubscriptionCouponById = async (
  accessToken,
  uid,
  client,
  coupon,
  subscriptionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(
    `api/v1/subscriptions/${subscriptionId}/apply_coupon`,
    { coupon }
  );
};

export const verifyCoupon = async (accessToken, uid, client, coupon) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/coupons/is_valid?coupon=${coupon}`);
};

export const updateSubscriptionPlanById = async (
  accessToken,
  uid,
  client,
  plan,
  subscriptionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/subscriptions/${subscriptionId}`,
    plan
  );
};

export const cancelSubscription = async (
  accessToken,
  uid,
  client,
  subscriptionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/subscriptions/${subscriptionId}/cancel`,
    subscriptionId
  );
};

export const activeSubscription = async (
  accessToken,
  uid,
  client,
  subscriptionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/subscriptions/${subscriptionId}/active`,
    subscriptionId
  );
};

export const downgradeSubscription = async (
  accessToken,
  uid,
  client,
  plan,
  subscriptionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/subscriptions/${subscriptionId}/downgrade`,
    plan
  );
};

export const releaseSubscription = async (
  accessToken,
  uid,
  client,
  subscriptionId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(
    `api/v1/subscriptions/${subscriptionId}/release`
  );
};

export const createSubscription = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/subscriptions`, payload);
};
