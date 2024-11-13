import * as process from 'process';
import dotenv from 'dotenv';

dotenv.config();

const isRequired = (propName: string): never => {
  throw new Error(`Config property ${propName} is required`);
};

class Config {
  server = {
    restPort: process.env.REST_PORT ?? isRequired('REST_PORT'),
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
