import { DataSource, DataSourceOptions } from 'typeorm';
import * as entities from '../entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'election',
  password: process.env.POSTGRES_PASSWORD || 'election_secret',
  database: process.env.POSTGRES_DB || 'election',
  entities: Object.values(entities).filter((entity) => typeof entity === 'function'),
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);
