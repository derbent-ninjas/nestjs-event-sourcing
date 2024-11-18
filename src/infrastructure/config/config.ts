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

  kafka = {
    kafkaStockEventsTopic:
      process.env.KAFKA_STOCK_EVENTS_TOPIC ??
      isRequired('KAFKA_STOCK_EVENTS_TOPIC'),
    kafka1ExternalPort:
      process.env.KAFKA1_EXTERNAL_PORT ?? isRequired('KAFKA1_EXTERNAL_PORT'),
    kafka1Host: process.env.KAFKA1_HOST ?? isRequired('KAFKA1_HOST'),
  };

  debezium = {
    protocol: process.env.DEBEZIUM_PROTOCOL ?? isRequired('DEBEZIUM_PROTOCOL'),
    host: process.env.DEBEZIUM_HOST ?? isRequired('DEBEZIUM_HOST'),
    port: process.env.DEBEZIUM_PORT ?? isRequired('DEBEZIUM_PORT'),
  };
}

export const config = new Config();
