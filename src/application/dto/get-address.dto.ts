export interface GetAddressInput {
  cep: string;
}

export interface GetAddressOutput {
  cep: string;
  uf: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}
