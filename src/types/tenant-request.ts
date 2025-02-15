import { Request } from 'express';
import { EntityManager } from '@mikro-orm/core';

export interface TenantRequest extends Request {
  tenantEm?: EntityManager;
}
