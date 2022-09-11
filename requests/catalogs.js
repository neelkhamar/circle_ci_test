import server from "../apis/server";

export const materialSearch = async (accessToken, uid, client, query) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalogs/hazardous_materials?q=${query}`
  );
};

export const fractionSearch = async (accessToken, uid, client, query) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalogs/tariff_fractions?q=${query}`
  );
};

export const packagingSearch = async (accessToken, uid, client, query) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalogs/packagings?q=${query}`);
};

export const getAllListing = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalogs/settings_catalogs`);
};

export const saveData = async (accessToken, uid, client, key, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/${key}/add`, payload);
};

export const deleteData = async (accessToken, uid, client, key, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/${key}/${id}`);
};
