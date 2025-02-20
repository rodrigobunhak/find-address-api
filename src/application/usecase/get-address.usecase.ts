import { Inject, Injectable } from '@nestjs/common';
import { AddressFinderOrchestrator } from 'src/infra/address-finders-orchestrator';

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

  async execute(input: inputDto): Promise<outputDto> {
    const output = await this.finder.executeFind(input.cep);
    console.log(output.toJSON());
    return output;
  }
}
