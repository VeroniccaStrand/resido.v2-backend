import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { TenantConnectionFactory } from './tenant-connection.factory';
import { NextFunction } from 'express';
import { TenantRequest } from '../../types/tenant-request';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantConnectionFactory: TenantConnectionFactory,
  ) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    console.log(`📌 DEBUG: Tenant ID från request:`, req.headers);
    console.log(
      `📌 DEBUG: Alla headers:`,
      JSON.stringify(req.headers, null, 2),
    );

    const tenantId = req.headers['x-tenant-id'.toLowerCase()] as string;
    console.log(`📌 DEBUG: Tenant ID från request:`, tenantId);
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is missing');
    }
    console.log(`🛠️ Kopplar till tenant: ${tenantId}`);

    try {
      req.tenantEm =
        await this.tenantConnectionFactory.getTenantConnections(tenantId);
      next();
    } catch (error) {
      console.error(
        `❌ Misslyckades att ansluta till tenant: ${tenantId}`,
        error,
      );
      throw new UnauthorizedException('Invalid tenant ID');
    }
  }
}
