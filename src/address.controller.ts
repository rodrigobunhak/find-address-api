/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { GetAddressUseCase } from './application/usecase/get-address.usecase';
import { CepNotFoundError } from './infra/errors/infra.error';
import { InvalidCepError } from './domain/errors/domain.error';

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
    const result = await this.getAddressUseCase.execute({ cep });
    return result.unwrap(
      (success) => {
        return success;
      },
      (error) => {
        switch (true) {
          case error instanceof InvalidCepError:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          case error instanceof CepNotFoundError:
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
          default:
            throw new HttpException(
              'Internal Server Error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      },
    );
  }
}
