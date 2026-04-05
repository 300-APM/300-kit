import { describe, expect, it } from 'vitest'
import { TenantAwareEntity } from './tenant-aware.entity.js'

class TestTenantEntity extends TenantAwareEntity {
  name!: string
}

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('TenantAwareEntity', () => {
  it('should generate a valid uuid v7 id on construction', () => {
    const entity = new TestTenantEntity()
    expect(entity.id).toMatch(UUID_V7_REGEX)
  })

  it('should inherit BaseEntity properties', () => {
    const entity = new TestTenantEntity()
    expect(entity.createdAt).toBeInstanceOf(Date)
    expect(entity.updatedAt).toBeInstanceOf(Date)
    expect(entity.version).toBe(1)
  })

  it('should allow setting tenantId', () => {
    const entity = new TestTenantEntity()
    entity.tenantId = '01234567-0123-7abc-8000-000000000001'
    expect(entity.tenantId).toBe('01234567-0123-7abc-8000-000000000001')
  })

  it('should extend BaseEntity', () => {
    const entity = new TestTenantEntity()
    expect(entity).toBeInstanceOf(TenantAwareEntity)
  })
})
