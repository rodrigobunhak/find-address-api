import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAddressProvider } from 'src/domain/address.provider';

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
    @Inject('ViaCepProvider')
    private viaCepProvider: IAddressProvider,
    @Inject('BrasilApiProvider')
    private readonly brasilApiProvider: IAddressProvider,
  ) {}

  async execute(input: inputDto): Promise<outputDto> {
    const providers = [this.viaCepProvider, this.brasilApiProvider];
    const shuffledProviders = providers.sort(() => Math.random() - 0.5);
    for (const provider of shuffledProviders) {
      try {
        const address = await provider.getAddressByCep(input.cep);
        if (!address) {
          continue;
        }
        return address;
      } catch (error) {
        console.error(error);
        if (provider === shuffledProviders[shuffledProviders.length - 1]) {
          throw new NotFoundException('CEP não encontrado');
        }
        continue;
      }
    }
    throw new NotFoundException('CEP não encontrado');
  }
}
