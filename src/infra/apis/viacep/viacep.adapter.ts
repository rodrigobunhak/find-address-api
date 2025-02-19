import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IAddressProvider } from 'src/domain/address.provider';
import { Address } from 'src/domain/address.value-object';

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
export class ViaCepAdapter implements IAddressProvider {
  constructor(private readonly httpService: HttpService) {}

  async getAddressByCep(cep: string): Promise<Address | null> {
    console.log('ViaCep call...');
    const { data } = await firstValueFrom(
      this.httpService.get<ViaCepResponseDTO>(
        `https://viacep.com.br/ws/${cep}/json/`,
      ),
    );
    if (data.erro) {
      return null;
    }
    // TODO: Tratar erros de retorno da api
    return this.mapToAddress(data);
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
