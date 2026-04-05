import { BaseRepository } from '../database/base.repository.js'
import type { TenantAwareEntity } from './tenant-aware.entity.js'

export class TenantRepository<
  T extends TenantAwareEntity,
> extends BaseRepository<T> {}
