import * as process from 'process';

const isRequired = (propName: string): never => {
  throw new Error(`Config property ${propName} is required`);
};

class Config {
  server = {
    port: Number(process.env.PORT ?? isRequired('PORT')),
  };

  db = {
    username: process.env.DB_USERNAME ?? isRequired('DB_USERNAME'),
    password: process.env.DB_PASSWORD ?? isRequired('DB_PASSWORD'),
    host: process.env.DB_HOST ?? isRequired('DB_HOST'),
    port: Number(process.env.DB_PORT ?? isRequired('DB_PORT')),
    name: process.env.DB_NAME ?? isRequired('DB_NAME'),
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    ssl:
      process.env.DB_SSL === 'true'
        ? { ca: process.env.DB_CA_CERT, rejectUnauthorized: false }
        : false,
  };
}

export const config = new Config();
