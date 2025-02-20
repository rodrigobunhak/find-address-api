/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpService } from '@nestjs/axios';
import { Injectable, Optional } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/address.value-object';
import { CepNotFoundError } from 'src/infra/errors/infra.error';

export interface ViaCepResponseDTO {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  unidade?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  estado?: string;
  regiao?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

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
      const { data } = await firstValueFrom(
        this.httpService.get<ViaCepResponseDTO>(
          `https://viacep.com.br/ws/${cep}/json/`,
        ),
      );
      if (data.erro) {
        throw new Error();
      }
      return this.mapToAddress(data);
    } catch (error) {
      if (!this.next) throw new CepNotFoundError(cep);
      return this.next.find(cep);
    }
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
