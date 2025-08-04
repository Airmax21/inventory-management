import axios from 'axios';

const ApiClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}/api/v1`,
  timeout: 10_000,
});

ApiClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.set('Accept-Language', document.documentElement.lang);
    config.headers.set(
      'Accept-Timezone',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    return config;
  },
  function (error: Error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

export { ApiClient };
