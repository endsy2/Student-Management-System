import { prisma } from '@/config/database';
import { logger } from '@/config/logger';

/** Best-effort audit log; never throws into the request path. */
export async function writeAuditLog(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        details: params.details as object | undefined,
      },
    });
  } catch (err) {
    logger.warn(`Failed to write audit log: ${(err as Error).message}`);
  }
}
