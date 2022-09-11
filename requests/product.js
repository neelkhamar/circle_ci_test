import server from "../apis/server";

export const getAllProducts = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/product_services`);
};

export const productSearch = async (accessToken, uid, client, query) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalogs/product_services?q=${query}`
  );
};

export const measurementUnitSearch = async (
  accessToken,
  uid,
  client,
  query
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalogs/measurement_units?q=${query}`
  );
};

export const createProduct = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/product_services`, payload);
};

export const deleteProductById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/product_services/${id}`);
};

export const updateProduct = async (accessToken, uid, client, id, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/product_services/${id}`, payload);
};

export const getProductById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/product_services/${id}`);
};

export const taxRates = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalogs/tax_rates`);
};
