export type ErrorBody = {
  code: string;
  message: string;
  details?: unknown;
  fieldErrors?: Record<string, string>;
};

export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;
  fieldErrors?: Record<string, string>;
  constructor(code: string, message: string, status = 400, details?: unknown, fieldErrors?: Record<string, string>) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    this.fieldErrors = fieldErrors;
  }
}

export const err = (code: string, message: string, status = 400, details?: unknown, fieldErrors?: Record<string, string>) =>
  new AppError(code, message, status, details, fieldErrors);
