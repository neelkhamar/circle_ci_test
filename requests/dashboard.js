import server from "../apis/server";

export const getDashboardData = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/dashboards`);
};
