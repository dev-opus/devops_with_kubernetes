import dotenv from 'dotenv';
dotenv.config();

let configMessagePrinted = false;

export const config = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    superUser: process.env.DB_SUPER_USER,
    superPassword: process.env.DB_SUPER_PASSWORD,
  },
};

export const ensureConfigDefined = (
  config: Record<
    string,
    string | undefined | Record<string, string | undefined>
  >,
  path: string[] = []
) => {
  for (const [key, value] of Object.entries(config)) {
    const currentPath = [...path, key].join('.');
    if (typeof config[key] === 'object') {
      if (!value) {
        throw new Error(`Missing config value: ${currentPath}`);
      }

      if (typeof value === 'object') {
        ensureConfigDefined(value, [...path, key]);
      }
    }

    if (!value) {
      throw new Error(`Missing config value: ${currentPath}`);
    }
  }

  if (configMessagePrinted) {
    return;
  }

  console.log('Config loaded successfully');
  configMessagePrinted = true;
};
