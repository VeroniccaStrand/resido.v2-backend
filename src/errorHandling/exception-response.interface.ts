export interface ExceptionResponse {
  message: string;
  code?: string;
  context?: string;
  metadata?: Record<string, unknown>;
}
