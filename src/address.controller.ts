import { Controller, Get, Param } from '@nestjs/common';
import { GetAddressUseCase } from './application/usecase/get-address.usecase';

interface AddressResponseDto {
  cep: string;
  uf: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

@Controller('cep')
export class AddressController {
  constructor(private readonly getAddressUseCase: GetAddressUseCase) {}

  @Get(':cep')
  async getAddress(@Param('cep') cep: string): Promise<AddressResponseDto> {
    return this.getAddressUseCase.execute({ cep });
  }
}
