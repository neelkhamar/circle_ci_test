import server from "../apis/server";

export const getAllNotification = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/notifications?alert_type=nothing`);
};

export const setMarkAsRead = async (
  accessToken,
  uid,
  client,
  notification_id
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).put(
    `api/v1/notifications/mark_as_read/${notification_id}`
  );
};
