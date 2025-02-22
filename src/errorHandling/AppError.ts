import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly code?: string,
    public readonly context?: string,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super({ message, status, code, context, metadata }, status);
  }
}
