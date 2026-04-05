import { defineDbConfig } from '@300apm/nestjs-core/database/mikro-orm.config'

export default defineDbConfig({ dbName: process.env.DB_NAME ?? '300kit' })
