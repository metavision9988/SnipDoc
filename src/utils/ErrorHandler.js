class ErrorHandler {
  static createError(message, statusCode = 500, type = 'GENERIC_ERROR') {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.type = type;
    return error;
  }

  static handleValidationError(field, value, constraint) {
    return this.createError(
      `Invalid ${field}: ${value}. ${constraint}`,
      400,
      'VALIDATION_ERROR'
    );
  }

  static handleFileError(message) {
    return this.createError(message, 400, 'FILE_ERROR');
  }

  static handlePDFGenerationError(message) {
    return this.createError(
      `PDF Generation Error: ${message}`,
      500,
      'PDF_GENERATION_ERROR'
    );
  }

  static handleContentError(message) {
    return this.createError(
      `Content Processing Error: ${message}`,
      400,
      'CONTENT_ERROR'
    );
  }

  static isOperationalError(error) {
    return error.isOperational === true || error.statusCode < 500;
  }

  static formatErrorResponse(error) {
    return {
      error: error.message,
      type: error.type || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
  }

  static logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message: error.message,
      type: error.type || 'UNKNOWN_ERROR',
      statusCode: error.statusCode || 500,
      stack: error.stack,
      context
    };

    if (error.statusCode >= 500) {
      console.error('Server Error:', logEntry);
    } else {
      console.warn('Client Error:', logEntry);
    }
  }
}

module.exports = ErrorHandler;