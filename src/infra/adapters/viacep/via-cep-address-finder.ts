/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpService } from '@nestjs/axios';
import { Injectable, Optional } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/value-object/address.value-object';
import { CepNotFoundError } from 'src/infra/errors/infra.error';
import { ViaCepResponseDTO } from './via-cep-address-finder.dto';

@Injectable()
export class ViaCepAddressFinder implements AddressFinder {
  constructor(
    private readonly httpService: HttpService,
    @Optional()
    readonly next?: AddressFinder,
  ) {}

  getName(): string {
    return 'Via Cep';
  }

  async find(cep: string): Promise<Address> {
    try {
      const { data } = await firstValueFrom(this.httpService.get<ViaCepResponseDTO>(`https://viacep.com.br/ws/${cep}/json/`));
      if (data && !data.erro) {
        return this.mapToAddress(data);
      }
      return this.callNextFinder(cep);
    } catch (error) {
      return this.callNextFinder(cep);
    }
  }

  private callNextFinder(cep: string): Promise<Address> {
    if (!this.next) {
      throw new CepNotFoundError(cep);
    }
    return this.next.find(cep);
  }

  private mapToAddress(response: ViaCepResponseDTO): Address {
    return Address.create({
      cep: response.cep,
      uf: response.uf,
      state: response.estado,
      city: response.localidade,
      neighborhood: response.bairro,
      street: response.logradouro,
    });
  }
}
