class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = null
  ) {
    super(message); // Calls the constructor of the built-in Error class
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    
    if (stack) {
      // If a stack trace is explicitly provided, use it
      this.stack = stack;
    } else {
      // Automatically capture the current stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };


// // overide {}
































