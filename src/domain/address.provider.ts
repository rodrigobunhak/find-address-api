import { Address } from './address.value-object';

export interface IAddressProvider {
  getAddressByCep(cep: string): Promise<Address>;
}
