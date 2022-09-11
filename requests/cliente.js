import server from "../apis/server";

export const getCustomers = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/customers`);
};

export const createCustomers = async (accessToken, uid, client, payload) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).post(`api/v1/customers`, payload);
};

export const updateCustomers = async (
  accessToken,
  uid,
  client,
  id,
  payload
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).patch(`api/v1/customers/${id}`, payload);
};

export const deleteCustomers = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).delete(`api/v1/customers/${id}`);
};

export const getCustomerById = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/customers/${id}`);
};

export const getProductTipoOptions = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalog_product_categories/types`);
};

export const getProductOptions = async (accessToken, uid, client, id) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_product_categories/${id}/categories`
  );
};

export const searchProductCategory = async (
  accessToken,
  uid,
  client,
  query
) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(
    `api/v1/catalog_product_categories/search?${query}`
  );
};

export const getTaxRegime = async (accessToken, uid, client) => {
  let options = {
    headers: { client: client, uid: uid, "access-token": accessToken },
  };
  return await server(options).get(`api/v1/catalogs/tax_regimes`);
};
