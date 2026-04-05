import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { type DynamicModule, Module } from '@nestjs/common'

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic modules require a class with static forRoot
export class DatabaseModule {
  static forRoot(config: MikroOrmModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MikroOrmModule.forRoot(config)],
    }
  }
}
