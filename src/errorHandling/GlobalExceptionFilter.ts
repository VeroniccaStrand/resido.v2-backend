import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

interface ExceptionResponse {
  message: string | string[]; // 👈 Acceptera både sträng och array av valideringsfel
  code?: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let code = 'UNKNOWN_ERROR';
    let metadata: Record<string, unknown> = {};
    let context = 'GlobalExceptionFilter';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();

      if (typeof responseData === 'string') {
        message = responseData;
      } else if (this.isExceptionResponse(responseData)) {
        message = responseData.message;
        code = responseData.code ?? code;
        context = responseData.context ?? context;
        metadata = responseData.metadata ?? {};
      } else if (exception instanceof BadRequestException) {
        // 🔥 Om det är en valideringserror, hämta detaljerade fel
        const validationErrors = responseData as any;
        message = validationErrors.message || validationErrors; // 👈 Tar antingen meddelandet eller hela objektet
      }
    }

    // 🔥 Logga felet med request-metadata
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    const userId = request.headers['x-user-id'] as string | undefined;

    this.logger.error({
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url,
      status,
      message,
      code,
      tenantId,
      userId,
      metadata,
      stack: exception instanceof Error ? exception.stack : null,
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message, // 🚀 Nu innehåller detta detaljerad valideringsinfo
      code,
      context,
    });
  }

  private isExceptionResponse(obj: unknown): obj is ExceptionResponse {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'message' in obj &&
      (typeof (obj as ExceptionResponse).message === 'string' ||
        Array.isArray((obj as ExceptionResponse).message))
    );
  }
}
