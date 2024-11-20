import { loadEnvironment } from '../src/infrastructure/shared/utils/loadEnvironment';

loadEnvironment();
import { config } from '../src/infrastructure/config/config';
import axios from 'axios';
import { inspect } from 'util';

(async (): Promise<void> => {
  try {
    const body = createBody();
    const { protocol, host, port } = config.debezium;
    const url = `${protocol}://${host}:${port}/connectors/`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await axios.post(url, body, { headers });

    console.log(inspect({ response }, { depth: 15 }));
  } catch (e) {
    console.error('Error creating connector:', e);
  }

  function createBody(): object {
    const { name, username, password, host, port } = config.db;

    const headerMappings = [
      'seq_id:header:messageId',
      'event_id:header:eventId',
      'event_name:header:eventName',
      'aggregate_id:header:aggregateId',
      'aggregate_name:header:aggregateName',
      'context_name:header:contextName',
      'causation_id:header:causationId',
      'correlation_id:header:correlationId',
      'version:header:version',
      'created_at:header:createdAt',
    ].join(',');

    return {
      name: 'sales-product-outbox-connector',
      config: {
        'connector.class': 'io.debezium.connector.postgresql.PostgresConnector',
        'plugin.name': 'pgoutput',
        'tasks.max': '1',
        'database.hostname': host,
        'database.server.name': host,
        'database.port': port,
        'database.user': username,
        'database.password': password,
        'database.dbname': name,
        'topic.prefix': 'prefix',
        'table.include.list': 'public.stock_month_events',
        'tombstones.on.delete': 'false',
        transforms: 'outbox',
        'transforms.outbox.type': 'io.debezium.transforms.outbox.EventRouter',
        'transforms.outbox.route.topic.replacement':
          config.kafka.kafkaStockEventsTopic,
        'transforms.outbox.table.field.event.key': 'correlation_id',
        'transforms.outbox.table.field.event.type': 'event_name',
        'transforms.outbox.table.field.event.id': 'seq_id',
        'transforms.outbox.table.field.event.payload': 'data',
        'transforms.outbox.route.by.field': 'context_name',
        'transforms.outbox.table.fields.additional.placement': headerMappings,
      },
    };
  }
})();
