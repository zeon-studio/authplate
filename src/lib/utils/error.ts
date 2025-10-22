export interface IErrorMessage {
  path: string;
  message: string;
}

export class CustomApiError extends Error {
  statusCode: number;
  errorMessage: IErrorMessage[];

  constructor(
    statusCode: number,
    message: string,
    errorMessage: IErrorMessage[] = [],
  ) {
    super(message);
    this.name = "CustomApiError";
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}
