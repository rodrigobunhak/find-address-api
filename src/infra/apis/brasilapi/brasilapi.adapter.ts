import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IAddressProvider } from 'src/domain/address.provider';
import { Address } from 'src/domain/address.value-object';

export interface BrasilApiResponseDTO {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

@Injectable()
export class BrasilApiAdapter implements IAddressProvider {
  constructor(private readonly httpService: HttpService) {}

  async getAddressByCep(cep: string): Promise<Address | null> {
    console.log('BrasilApi call...');
    const { data } = await firstValueFrom(
      this.httpService.get<BrasilApiResponseDTO>(
        `https://brasilapi.com.br/api/cep/v1/${cep}`,
      ),
    );
    // TODO: Tratar erros de retorno da api
    return this.mapToAddress(data);
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
