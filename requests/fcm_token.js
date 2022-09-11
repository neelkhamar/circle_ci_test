import server from "../apis/server";

export const addFcmToken = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/fcm_tokens`, payload);
};
