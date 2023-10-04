const requireEnv = (key: string) => {
  const envVar = process.env[key];
  if (!envVar) {
    throw new Error(`Please set ${key} in environment`);
  }
  return envVar;
};

export function validateEnvVars() {
  try {
    requireEnv('MONGO_URI');
    requireEnv('JWT_SECRET');
    requireEnv('CRYPTO_PASSWORD');
    requireEnv('OPENAI_API_KEY');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
