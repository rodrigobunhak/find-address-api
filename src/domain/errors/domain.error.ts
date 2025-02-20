export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidCepError extends DomainError {
  constructor(cep: string) {
    super(`${cep} is not a valid cep`);
  }
}

export class InvalidUFError extends DomainError {
  constructor(uf: string) {
    super(`${uf} is not a valid UF`);
  }
}
