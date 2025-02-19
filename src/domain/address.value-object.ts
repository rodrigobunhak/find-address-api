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
    private readonly _cep: string,
    private readonly _uf: string,
    private readonly _state: string,
    private readonly _city: string,
    private readonly _neighborhood: string,
    private readonly _street: string,
  ) {}

  static create(props: CreateAddressProperties): Address {
    if (!Address.isValidCep(props.cep)) {
      throw new Error('CEP inválido'); // TODO: Criar um erro no dominio
    }

    if (!Address.isValidUF(props.uf)) {
      throw new Error('UF inválida'); // TODO: Criar um erro no dominio
    }

    return new Address(
      Address.formatCep(props.cep),
      props.uf.toLocaleUpperCase(),
      props.state,
      props.city,
      props.neighborhood,
      props.street,
    );
  }

  get cep(): string {
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

  private static isValidCep(cep: string): boolean {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep);
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

  private static formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }

  // TODO: fazer comparação completa de objeto
  equals(other: Address): boolean {
    return this._cep === other.cep;
  }

  toJSON() {
    return {
      cep: this._cep,
      uf: this._uf,
      state: this._state,
      city: this._city,
      neighborhood: this._neighborhood,
      street: this._street,
    };
  }
}
