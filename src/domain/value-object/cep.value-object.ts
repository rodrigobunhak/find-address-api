import { InvalidCepError } from '../errors/domain.error';

export class Cep {
  private constructor(private readonly _value: string) {}

  static create(cep: string): Cep {
    if (!Cep.isValidCep(cep)) {
      throw new InvalidCepError();
    }
    return new Cep(Cep.formatCep(cep));
  }

  get value(): string {
    return this._value;
  }

  public toString(): string {
    const cleanCep = this._value.replace(/\D/g, '');
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }

  private static isValidCep(cep: string): boolean {
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!cepRegex.test(cep)) {
      return false;
    }
    const cleanCep = cep.replace(/\D/g, '');
    return !/^(\d)\1+$/.test(cleanCep) && cleanCep !== '00000000';
  }

  private static formatCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }
}
