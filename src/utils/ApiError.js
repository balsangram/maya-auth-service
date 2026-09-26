class ApiError extends Error {
  constructor(statusCodeOrMessage, messageOrStatusCode = 500, errors = [], stack = "") {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (typeof statusCodeOrMessage === "number") {
      statusCode = statusCodeOrMessage;
      if (typeof messageOrStatusCode === "string") {
        message = messageOrStatusCode;
      }
    } else if (typeof statusCodeOrMessage === "string") {
      message = statusCodeOrMessage;
      if (typeof messageOrStatusCode === "number") {
        statusCode = messageOrStatusCode;
      }
    }

    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : (errors ? [errors] : []);
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = "Bad Request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized access") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden access") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict with existing data") {
    return new ApiError(409, message);
  }

  static internal(message = "Internal Server Error", errors = []) {
    return new ApiError(500, message, errors);
  }
}

export const ErrorResponse = ApiError;
export default ApiError;
