import type { ExecutionContext } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common'
import { describe, expect, it } from 'vitest'
import { TenantGuard } from './tenant.guard.js'
import { TENANT_REQUEST_KEY } from './tenant.middleware.js'

function createMockContext(request: Record<string, unknown>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
      getNext: () => () => {},
    }),
    getClass: () => Object,
    getHandler: () => () => {},
    getArgs: () => [],
    getArgByIndex: () => undefined,
    switchToRpc: () => ({}) as never,
    switchToWs: () => ({}) as never,
    getType: () => 'http',
  } as unknown as ExecutionContext
}

describe('TenantGuard', () => {
  const guard = new TenantGuard()

  it('should allow request with tenant id', () => {
    const ctx = createMockContext({
      [TENANT_REQUEST_KEY]: 'tenant-123',
    })
    expect(guard.canActivate(ctx)).toBe(true)
  })

  it('should throw ForbiddenException when tenant id is missing', () => {
    const ctx = createMockContext({})
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException)
  })

  it('should throw ForbiddenException when tenant id is undefined', () => {
    const ctx = createMockContext({
      [TENANT_REQUEST_KEY]: undefined,
    })
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException)
  })
})
