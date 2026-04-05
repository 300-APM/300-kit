import { Migrator } from '@mikro-orm/migrations'
import { defineConfig, type Options } from '@mikro-orm/postgresql'
import { SeedManager } from '@mikro-orm/seeder'

export function defineDbConfig(overrides: Options = {}): Options {
  const { extensions = [], migrations = {}, seeder = {}, ...rest } = overrides

  return defineConfig({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    dbName: process.env.DB_NAME ?? 'postgres',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    extensions: [Migrator, SeedManager, ...extensions],
    migrations: {
      path: 'dist/migrations',
      pathTs: 'src/migrations',
      ...migrations,
    },
    seeder: {
      path: 'dist/seeders',
      pathTs: 'src/seeders',
      ...seeder,
    },
    ...rest,
  })
}
