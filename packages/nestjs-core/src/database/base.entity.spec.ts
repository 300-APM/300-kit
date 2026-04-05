import { describe, expect, it } from 'vitest'
import { BaseEntity } from './base.entity.js'

class TestEntity extends BaseEntity {
  name!: string
}

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('BaseEntity', () => {
  it('should generate a valid uuid v7 id on construction', () => {
    const entity = new TestEntity()
    expect(entity.id).toMatch(UUID_V7_REGEX)
  })

  it('should generate unique ids across instances', () => {
    const a = new TestEntity()
    const b = new TestEntity()
    expect(a.id).not.toBe(b.id)
  })

  it('should set createdAt and updatedAt to now', () => {
    const before = new Date()
    const entity = new TestEntity()
    const after = new Date()

    expect(entity.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(entity.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(entity.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('should initialize version to 1', () => {
    const entity = new TestEntity()
    expect(entity.version).toBe(1)
  })

  it('should produce time-sortable ids', () => {
    const ids = Array.from({ length: 10 }, () => new TestEntity().id)
    const sorted = [...ids].sort()
    expect(ids).toEqual(sorted)
  })
})
