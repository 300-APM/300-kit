import { DatabaseModule } from '@300apm/nestjs-core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import config from './mikro-orm.config.js'

@Module({
  imports: [DatabaseModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
