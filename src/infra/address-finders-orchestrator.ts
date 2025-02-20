import { Inject, Injectable } from '@nestjs/common';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/address.value-object';

@Injectable()
export class AddressFinderOrchestrator {
  constructor(
    @Inject('AddressFinders') private readonly finders: AddressFinder[],
  ) {}

  private shuffleFinders(): AddressFinder[] {
    return [...this.finders].sort(() => Math.random() - 0.5);
  }

  private buildChain(finders: AddressFinder[]): AddressFinder {
    for (let i = 0; i < finders.length - 1; i++) {
      finders[i].next = finders[i + 1];
    }
    return finders[0];
  }

  async executeFind(cep: string): Promise<Address> {
    const shuffledFinders = this.shuffleFinders();
    const chain = this.buildChain(shuffledFinders);
    return await chain.find(cep);
  }
}
