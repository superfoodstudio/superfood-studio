import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoffMultiplier?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoffMultiplier = 2 } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on certain errors
      if (error instanceof PrismaClientKnownRequestError) {
        // Don't retry on validation errors, unique constraint violations, etc.
        if (['P2002', 'P2003', 'P2025'].includes(error.code)) {
          throw error;
        }
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(backoffMultiplier, attempt);
      console.log(`Database operation failed, retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

export function isConnectionError(error: unknown): boolean {
  if (error instanceof PrismaClientKnownRequestError) {
    return ['P2010', 'P2024', 'P2028'].includes(error.code);
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('server selection timeout') ||
           message.includes('connection') ||
           message.includes('network') ||
           message.includes('timeout');
  }
  
  return false;
}

export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    return await withRetry(operation, { maxRetries: 2, delay: 500 });
  } catch (error) {
    console.error('Database operation failed after retries:', error);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    return null;
  }
}