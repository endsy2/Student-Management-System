import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from './logger';

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info('✅ PostgreSQL connected');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
