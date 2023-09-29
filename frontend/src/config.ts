const requireEnv = (key: string) => {
  const envVar = import.meta.env[key];
  if (!envVar) {
    throw new Error(`Please set ${key} in environment`);
  }
  return envVar;
};

export const VITE_APP_BACKEND_URL = requireEnv('VITE_APP_BACKEND_URL');
