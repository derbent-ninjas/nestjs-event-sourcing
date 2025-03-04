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
    kafka1DockerPort: process.env.KAFKA1_DOCKER_PORT ?? isRequired('KAFKA1_DOCKER_PORT'),
    kafka1HostExternal: process.env.KAFKA1_HOST_EXTERNAL ?? isRequired('KAFKA1_HOST_EXTERNAL'),
    consumerGroup:
      process.env.KAKFA_CONSUMER_GROUP ?? isRequired('KAKFA_CONSUMER_GROUP'),
  };

  debezium = {
    protocol: process.env.DEBEZIUM_PROTOCOL ?? isRequired('DEBEZIUM_PROTOCOL'),
    host: process.env.DEBEZIUM_HOST ?? isRequired('DEBEZIUM_HOST'),
    port: process.env.DEBEZIUM_PORT ?? isRequired('DEBEZIUM_PORT'),
  };
}

export const config = new Config();
