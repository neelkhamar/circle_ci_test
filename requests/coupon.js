import server from "../apis/server";

export const getCoupons = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/coupons`);
};

export const getCouponById = async (accessToken, uid, client, couponId) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/coupons/${couponId}`);
};

export const createCoupon = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/coupons`, { coupon: payload });
};

export const updateCouponById = async (
  accessToken,
  uid,
  client,
  payload,
  couponId
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/coupons/${couponId}`, payload);
};

export const deleteCouponById = async (accessToken, uid, client, couponId) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/coupons/${couponId}`);
};

export const getUsers = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/users/company_users`);
};

export const sendCouponToUsers = async (
  accessToken,
  uid,
  client,
  couponId,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(
    `api/v1/coupons/${couponId}/send_coupon`,
    payload
  );
};
