export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error
  }

  if (error instanceof Error) {
    return new APIError(500, error.message)
  }

  return new APIError(500, "An unexpected error occurred")
}

export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const message = error instanceof Error ? error.message : String(error)

  console.error(`[${timestamp}] ${context || "Error"}:`, message)

  // In production, send to error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: sendToSentry(error, context)
  }
}
