import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { type DynamicModule, Module } from '@nestjs/common'

export { BaseEntity } from './base.entity.js'
export { BaseRepository } from './base.repository.js'
export { defineDbConfig } from './mikro-orm.config.js'
export { MikroOrmModule }

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic modules require a class with static forRoot
export class DatabaseModule {
  static forRoot(config: MikroOrmModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MikroOrmModule.forRoot(config)],
      exports: [MikroOrmModule],
    }
  }
}
