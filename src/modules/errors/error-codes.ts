export enum ErrorCode {
  // General Errors
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_ID = 'INVALID_ID',

  // Auth Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PASSWORD_RESET_FAILED = 'PASSWORD_RESET_FAILED',
  EMAIL_VERIFICATION_FAILED = 'EMAIL_VERIFICATION_FAILED',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  EMAIL_ALREADY_TAKEN = 'EMAIL_ALREADY_TAKEN',

  // HR Specific Errors
  EMPLOYEE_NOT_FOUND = 'EMPLOYEE_NOT_FOUND',
  DUPLICATE_EMPLOYEE = 'DUPLICATE_EMPLOYEE',
  INVALID_LEAVE_REQUEST = 'INVALID_LEAVE_REQUEST',
}
