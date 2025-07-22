import { APIErrorHandler } from "@utils/errorHandler";

/**
 * Generic service method wrapper that provides consistent error handling
 * across all service methods
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const parsedError = APIErrorHandler.parseError(error);

    if (APIErrorHandler.shouldLog(parsedError)) {
      console.error(`Error in ${context}:`, {
        error: parsedError,
        originalError: error,
        timestamp: new Date().toISOString(),
        context,
      });
    }

    throw error;
  }
}

/**
 * Service class mixin that provides error handling capabilities
 */
export class BaseService {
  protected async handleRequest<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    return withErrorHandling(operation, context);
  }
}
