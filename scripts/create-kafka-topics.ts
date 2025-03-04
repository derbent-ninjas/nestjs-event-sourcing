import { loadEnvironment } from '../src/infrastructure/shared/utils/loadEnvironment';

loadEnvironment();
import { Kafka } from 'kafkajs';
import { config } from '../src/infrastructure/config/config';

(async (): Promise<void> => {
  const kafka = createKafka();
  const admin = kafka.admin();

  await admin.connect();

  const toCreateTopics = [config.kafka.kafkaStockEventsTopic];

  const areTopicsCreated = await admin.createTopics({
    topics: toCreateTopics.map((topic) => ({
      topic,
      numPartitions: 1,
      replicationFactor: 1,
    })),
  });

  if (areTopicsCreated) {
    console.log(`topics ${toCreateTopics} are successfully created`);
  }

  await admin.disconnect();

  function createKafka(): Kafka {
    return new Kafka({
      clientId: 'acceptance-tests',
      brokers: [`${config.kafka.kafka1HostExternal}:29093`],
    });
  }
})();
