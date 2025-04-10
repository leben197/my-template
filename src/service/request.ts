
export function createServiceConfig(env) {
  const { VITE_SERVICE_BASE_URL } = env;
  const httpConfig = {
    baseURL: VITE_SERVICE_BASE_URL
  };

  const config = {
    baseURL: httpConfig.baseURL
  };

  return config;
}
export function getServiceBaseURL(env) {
  const { baseURL } = createServiceConfig(env);
  return {
    baseURL
  };
}
