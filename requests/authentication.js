import server from "../apis/server";
import { CONFIRM_SUCCESS_URL } from "../apis/constants";

export const loginSat = async (rfc, password) => {
  return await server().post("api/v1/sat_authentications", { rfc, password });
};

export const signUp = async (email, password, passwordConfirmation) => {
  return await server().post("auth", {
    email,
    password,
    password_confirmation: passwordConfirmation,
    confirm_success_url: CONFIRM_SUCCESS_URL,
  });
};

export const signIn = async (email, password) => {
  return await server().post("auth/sign_in", { email, password });
};

export const confirmation = async (config, token, redirect_url) => {
  return await server().get(
    `auth/confirmation/?config=${config}&confirmation_token=${token}&redirect_url=${redirect_url}`
  );
};

export const signOut = async (client, accessToken, uid) => {
  let options = {
    headers: { client: client, uid: uid, access_token: accessToken },
  };
  return await server(options).delete("auth/sign_out");
};
