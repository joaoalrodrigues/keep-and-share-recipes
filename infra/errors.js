export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected internal error has ocurred.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact the admnistrator.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || "Service unavailable at the moment.", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verify service availability.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Method not allowed for this endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Verify allowed HTTP methods for this endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, action, message }) {
    super(message || "A validation error has ocurred.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Provide valid data and try again.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    this.name = "NotFoundError";
    this.message = message;
    this.action = "Verify if you are passing a valid id.";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
