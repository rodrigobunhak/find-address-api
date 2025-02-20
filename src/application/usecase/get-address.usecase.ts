import { Inject, Injectable } from '@nestjs/common';
import { AddressFinderOrchestrator } from 'src/infra/address-finders-orchestrator';
import { Result } from '@badrap/result';
import { GetAddressInput, GetAddressOutput } from '../dto/get-address.dto';
import { Cep } from 'src/domain/value-object/cep.value-object';

@Injectable()
export class GetAddressUseCase {
  constructor(
    @Inject('AddressFinderOrchestrator')
    private readonly finder: AddressFinderOrchestrator,
  ) {}

  async execute(input: GetAddressInput): Promise<Result<GetAddressOutput>> {
    try {
      const cep = Cep.create(input.cep);
      const address = await this.finder.executeFind(cep.value);
      const output: GetAddressOutput = {
        cep: address.cep.value,
        uf: address.uf,
        state: address.state,
        city: address.city,
        neighborhood: address.neighborhood,
        street: address.street,
        fullAddress: address.toString(),
      };
      return Result.ok(output);
    } catch (error) {
      return Result.err(error);
    }
  }
}
