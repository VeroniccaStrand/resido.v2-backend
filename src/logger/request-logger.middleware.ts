import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;
    const { method, ip, originalUrl } = req;

    // ✅ Använd originalUrl istället för req.route.path
    const requestPath = originalUrl || 'UnknownRoute';

    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(
        `[${method}] [${requestPath}] [Tenant: ${tenantId}] [User: ${userId}] [IP: ${ip}] - Status: ${res.statusCode} (${duration}ms)`,
        'RequestLoggerMiddleware',
      );
    });

    next();
  }
}
