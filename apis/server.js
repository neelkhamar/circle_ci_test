import axios from 'axios';
import alertContainer from '../utils/Alert';
import { logout } from '../redux/user/Action';
import { store } from '../redux/configureStore';
import Router from 'next/router';
import { API_URL } from './constants';

//const url = 'http://localhost:3001/';
const url = API_URL;

let axiosResponse = null;

const apiServer = (options = {}) => {

  const { headers, bufferResponse } = options || {};
  let object = {
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    },
  }
  if(bufferResponse) {
    object["responseType"] = 'arraybuffer';
  }
  axiosResponse = axios.create(object);
  
  axiosResponse.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      if(err.response.status === 401 && !err.response.config.url.includes("/sign_in")) {
        alertContainer({
          title: 'No autorizado',
          text: err.response.data.errors[0],
          icon: 'error',
          showConfirmButton: false
        });
        store.dispatch(logout());
      }

      if(err.response.status === 402 && !err.response.config.url.includes("/sign_in")) {
        alertContainer({
          title: 'Pago Requerido',
          text: err.response.data.message || err.response.data.errors[0],
          icon: 'warning',
          showConfirmButton: false
        });
        Router.push('/subscription/settings/');
      }
      return Promise.reject(err);
    }
  );
  return axiosResponse;
}



export default apiServer
