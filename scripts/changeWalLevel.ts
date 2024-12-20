import { loadEnvironment } from '../src/infrastructure/shared/utils/loadEnvironment';
loadEnvironment();
import { config } from '../src/infrastructure/config/config';
import { Client } from 'pg';

(async (): Promise<void> => {
  const { name, username, password, host, port } = config.db;
  const connectionString = `postgresql://${username}:${password}@${host}:${port}/${name}`;

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const query = `ALTER SYSTEM SET wal_level = logical;`;
    await client.query(query);
    console.log('wal_level changed to logical');
  } catch (e) {
    console.error('Error creating connector:', e);
  } finally {
    await client.end();
  }
})();
