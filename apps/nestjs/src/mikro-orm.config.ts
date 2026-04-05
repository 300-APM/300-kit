import { defineDbConfig } from '@300apm/nestjs-core'

export default defineDbConfig({ dbName: process.env.DB_NAME ?? '300kit' })
