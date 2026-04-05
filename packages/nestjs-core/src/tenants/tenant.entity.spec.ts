import { describe, expect, it } from 'vitest'
import { Tenant } from './tenant.entity.js'

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('Tenant', () => {
  it('should generate a valid uuid v7 id on construction', () => {
    const tenant = new Tenant()
    expect(tenant.id).toMatch(UUID_V7_REGEX)
  })

  it('should default active to true', () => {
    const tenant = new Tenant()
    expect(tenant.active).toBe(true)
  })

  it('should inherit BaseEntity properties', () => {
    const tenant = new Tenant()
    expect(tenant.createdAt).toBeInstanceOf(Date)
    expect(tenant.updatedAt).toBeInstanceOf(Date)
    expect(tenant.version).toBe(1)
  })
})
