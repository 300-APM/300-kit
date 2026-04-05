import { MikroORM } from '@mikro-orm/core'
import { Injectable, type NestMiddleware } from '@nestjs/common'

export const TENANT_HEADER = 'x-tenant-id'
export const TENANT_REQUEST_KEY = 'tenantId'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly orm: MikroORM) {}

  use(
    req: Record<string, unknown>,
    _res: unknown,
    next: (err?: unknown) => void,
  ): void {
    const headers = req.headers as Record<string, string | string[] | undefined>
    const tenantId = headers[TENANT_HEADER]

    if (typeof tenantId === 'string' && tenantId.length > 0) {
      req[TENANT_REQUEST_KEY] = tenantId

      const em = this.orm.em
      em.setFilterParams('tenant', { tenantId })
    }

    next()
  }
}
