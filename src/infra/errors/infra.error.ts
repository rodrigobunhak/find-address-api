export abstract class InfraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CepNotFoundError extends InfraError {
  constructor(cep: string) {
    super(`Cep ${cep} not found`);
  }
}
