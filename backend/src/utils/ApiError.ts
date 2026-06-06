export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, message: string, code = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST') {
    return new ApiError(400, message, code);
  }
  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }
  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }
  static notFound(message = 'Not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }
  static conflict(message: string, code = 'CONFLICT') {
    return new ApiError(409, message, code);
  }
}
