import axios from 'axios';

const ApiClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}/api/v1`,
  timeout: 10_000,
});

ApiClient.interceptors.request.use(
  function (config) {
    const appAuthStore = useAppAuthStore();

    if (appAuthStore.token) {
      config.headers.set('Authorization', `Bearer ${appAuthStore.token.token}`);
    }
    config.headers.set('Accept-Language', document.documentElement.lang);
    config.headers.set(
      'Accept-Timezone',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

ApiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  },
);

export { ApiClient };