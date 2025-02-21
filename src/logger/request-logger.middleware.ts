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
    const { method, url } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(
        `[${method}]-[${tenantId}] - [${userId}] ${url} - ${res.statusCode} (${duration}ms)`,
        'RequestLoggerMiddleware', // ✅ Kontext för loggen
      );
    });

    next();
  }
}
