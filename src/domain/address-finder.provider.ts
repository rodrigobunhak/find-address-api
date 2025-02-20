import { Address } from './address.value-object';

export interface AddressFinder {
  next?: AddressFinder;
  find(cep: string): Promise<Address>;
  getName(): string;
}
