import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { TENANT_REQUEST_KEY } from './tenant.middleware.js'

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const tenantId = request?.[TENANT_REQUEST_KEY]

    if (!tenantId) {
      throw new ForbiddenException('Missing tenant context')
    }

    return true
  }
}
