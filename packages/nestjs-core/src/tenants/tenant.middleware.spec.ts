import type { MikroORM } from '@mikro-orm/core'
import { describe, expect, it, vi } from 'vitest'
import {
  TENANT_HEADER,
  TENANT_REQUEST_KEY,
  TenantMiddleware,
} from './tenant.middleware.js'

function createMockOrm() {
  return {
    em: {
      setFilterParams: vi.fn(),
    },
  } as unknown as MikroORM
}

describe('TenantMiddleware', () => {
  it('should set tenantId on request from header', () => {
    const orm = createMockOrm()
    const middleware = new TenantMiddleware(orm)
    const req: Record<string, unknown> = {
      headers: { [TENANT_HEADER]: 'tenant-abc' },
    }
    const next = vi.fn()

    middleware.use(req, {}, next)

    expect(req[TENANT_REQUEST_KEY]).toBe('tenant-abc')
    expect(next).toHaveBeenCalledOnce()
  })

  it('should enable tenant filter on entity manager', () => {
    const orm = createMockOrm()
    const middleware = new TenantMiddleware(orm)
    const req: Record<string, unknown> = {
      headers: { [TENANT_HEADER]: 'tenant-abc' },
    }

    middleware.use(req, {}, vi.fn())

    expect(orm.em.setFilterParams).toHaveBeenCalledWith('tenant', {
      tenantId: 'tenant-abc',
    })
  })

  it('should not set tenantId when header is missing', () => {
    const orm = createMockOrm()
    const middleware = new TenantMiddleware(orm)
    const req: Record<string, unknown> = { headers: {} }
    const next = vi.fn()

    middleware.use(req, {}, next)

    expect(req[TENANT_REQUEST_KEY]).toBeUndefined()
    expect(orm.em.setFilterParams).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledOnce()
  })

  it('should not set tenantId when header is empty string', () => {
    const orm = createMockOrm()
    const middleware = new TenantMiddleware(orm)
    const req: Record<string, unknown> = {
      headers: { [TENANT_HEADER]: '' },
    }
    const next = vi.fn()

    middleware.use(req, {}, next)

    expect(req[TENANT_REQUEST_KEY]).toBeUndefined()
    expect(next).toHaveBeenCalledOnce()
  })
})
