import { InvalidUFError } from '../errors/domain.error';
import { Cep } from './cep.value-object';

type CreateAddressProperties = {
  cep: string;
  uf: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

export class Address {
  private constructor(
    private readonly _cep: Cep,
    private readonly _uf: string,
    private readonly _state: string,
    private readonly _city: string,
    private readonly _neighborhood: string,
    private readonly _street: string,
  ) {}

  static create(props: CreateAddressProperties): Address {
    if (!Address.isValidUF(props.uf)) {
      throw new InvalidUFError(props.uf);
    }
    return new Address(Cep.create(props.cep), props.uf.toLocaleUpperCase(), props.state, props.city, props.neighborhood, props.street);
  }

  get cep(): Cep {
    return this._cep;
  }

  get uf(): string {
    return this._uf;
  }

  get state(): string {
    return this._state;
  }

  get city(): string {
    return this._city;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get street(): string {
    return this._street;
  }

  private static isValidUF(uf: string): boolean {
    const validUFs = [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ];
    return validUFs.includes(uf.toUpperCase());
  }

  public toString(): string {
    return `${this.street}, ${this.neighborhood}, ${this.city}, ${this.state}, ${this.uf}, CEP ${this.cep.toString()}`;
  }

  public toJSON() {
    return {
      cep: this._cep.toString(),
      uf: this._uf,
      state: this._state,
      city: this._city,
      neighborhood: this._neighborhood,
      street: this._street,
    };
  }
}
