import {
  type DynamicModule,
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { TenantGuard } from './tenant.guard.js'
import {
  TENANT_HEADER,
  TENANT_REQUEST_KEY,
  TenantMiddleware,
} from './tenant.middleware.js'

export { Tenant } from './tenant.entity.js'
export { TenantGuard } from './tenant.guard.js'
export { TenantRepository } from './tenant.repository.js'
export { TenantAwareEntity } from './tenant-aware.entity.js'
export { TENANT_HEADER, TENANT_REQUEST_KEY, TenantMiddleware }

export interface TenantsModuleOptions {
  /** Route paths to exclude from the tenant guard (e.g. health checks). */
  excludeRoutes?: string[]
}

@Module({})
export class TenantsModule implements NestModule {
  private static excludeRoutes: string[] = []

  static forRoot(options: TenantsModuleOptions = {}): DynamicModule {
    TenantsModule.excludeRoutes = options.excludeRoutes ?? []

    return {
      module: TenantsModule,
      global: true,
      providers: [
        TenantMiddleware,
        TenantGuard,
        { provide: APP_GUARD, useClass: TenantGuard },
      ],
      exports: [TenantGuard],
    }
  }

  configure(consumer: MiddlewareConsumer): void {
    const middleware = consumer.apply(TenantMiddleware)

    if (TenantsModule.excludeRoutes.length > 0) {
      middleware.exclude(...TenantsModule.excludeRoutes)
    }

    middleware.forRoutes('*')
  }
}
