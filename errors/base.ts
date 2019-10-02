export class BaseError {
  constructor() {
    Error.apply(this, arguments)
  }
}

export class StandardError extends BaseError {
  constructor(public errorCode: number, public message: string) {
    super()
  }
}
