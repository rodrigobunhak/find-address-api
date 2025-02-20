/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpService } from '@nestjs/axios';
import { Injectable, Optional } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/address.value-object';
import { CepNotFoundError } from 'src/infra/errors/infra.error';

export interface BrasilApiResponseDTO {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

@Injectable()
export class BrasilApiAddressFinder implements AddressFinder {
  constructor(
    private readonly httpService: HttpService,
    @Optional()
    readonly next?: AddressFinder,
  ) {}

  async find(cep: string): Promise<Address> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<BrasilApiResponseDTO>(
          `https://brasilapi.com.br/api/cep/v1/${cep}`,
        ),
      );
      return this.mapToAddress(data);
    } catch (error) {
      if (!this.next) throw new CepNotFoundError(cep);
      return this.next.find(cep);
    }
  }

  getName(): string {
    return 'Brasil Cep';
  }

  private mapToAddress(response: BrasilApiResponseDTO): Address {
    return Address.create({
      cep: response.cep,
      uf: response.state,
      state: this.getStateNameByFederativeUnit(response.state),
      city: response.city,
      neighborhood: response.neighborhood,
      street: response.street,
    });
  }

  private getStateNameByFederativeUnit(federativeUnit: string): string {
    const states: Record<string, string> = {
      AC: 'Acre',
      AL: 'Alagoas',
      AP: 'Amapá',
      AM: 'Amazonas',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goiás',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RS: 'Rio Grande do Sul',
      RO: 'Rondônia',
      RR: 'Roraima',
      SC: 'Santa Catarina',
      SP: 'São Paulo',
      SE: 'Sergipe',
      TO: 'Tocantins',
    };
    return states[federativeUnit.toUpperCase()] ?? '';
  }
}
