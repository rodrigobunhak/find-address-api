export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidCepError extends DomainError {
  constructor() {
    super(InvalidCepError.message);
  }
  static readonly message = 'Cep is not valid';
}

export class InvalidUFError extends DomainError {
  constructor() {
    super(InvalidUFError.message);
  }
  static readonly message = 'UF is not valid';
}
