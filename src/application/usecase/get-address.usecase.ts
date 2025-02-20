/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable } from '@nestjs/common';
import { AddressFinderOrchestrator } from 'src/infra/address-finders-orchestrator';
import { Result } from '@badrap/result';
import { Cep } from 'src/domain/cep.value-object';

interface inputDto {
  cep: string;
}

interface outputDto {
  cep: string;
  uf: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

@Injectable()
export class GetAddressUseCase {
  constructor(
    @Inject('AddressFinderOrchestrator')
    private readonly finder: AddressFinderOrchestrator,
  ) {}

  async execute(input: inputDto): Promise<Result<outputDto>> {
    try {
      const cep = Cep.create(input.cep);
      const output = await this.finder.executeFind(cep.value);
      console.log(output.toJSON());
      return Result.ok(output);
    } catch (error) {
      return Result.err(error);
    }
  }
}
