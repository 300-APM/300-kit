import { Filter, Property } from '@mikro-orm/decorators/legacy'
import { BaseEntity } from '../database/base.entity.js'

@Filter({
  name: 'tenant',
  cond: (args: Record<string, unknown>) => ({
    tenantId: args.tenantId as string,
  }),
  default: true,
})
export abstract class TenantAwareEntity extends BaseEntity {
  @Property({ type: 'uuid' })
  tenantId!: string
}
