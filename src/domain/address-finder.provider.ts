import { Address } from './value-object/address.value-object';

export interface AddressFinder {
  next?: AddressFinder;
  find(cep: string): Promise<Address>;
  getName(): string;
}
