import server from "../apis/server";
import { setCurrentUser } from "../redux/user/Action";
import { store } from "../redux/configureStore";

export const getUserProfile = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  let result = await server(options).get(`api/v1/users/profile`);
  if (result.status === 200) {
    store.dispatch(
      setCurrentUser({ userDetails: JSON.stringify(result.data.data) })
    );
  }
  return result;
};

export const updateUserProfile = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).put(`api/v1/users/update_profile`, payload);
};

export const updateUserPassword = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  payload.password_confirmation = payload.password;
  return await server(options).patch(`auth`, payload);
};

export const updateUserAccount = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).put(`api/v1/users/update_account`, payload);
};

export const updateUserAlertType = async (
  accessToken,
  uid,
  client,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).put(`api/v1/users/update_alert_type`, payload);
};

export const updateUserAvatar = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/users/update_avatar`, payload);
};
