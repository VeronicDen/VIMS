export class ServerError extends Error {
  constructor(message: string,
              public code: string,
              readonly cause: Error) {
    super(message);
    Object.setPrototypeOf(this, ServerError);
  }
}
