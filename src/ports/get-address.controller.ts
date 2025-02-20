import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { GetAddressUseCase } from 'src/application/usecase/get-address.usecase';
import { InvalidCepError } from 'src/domain/errors/domain.error';
import { CepNotFoundError } from 'src/infra/errors/infra.error';
import { GetAddressInputDto, GetAddressOutputDto } from './get-address.dto';

@Controller('cep')
export class GetAddressController {
  constructor(private readonly getAddressUseCase: GetAddressUseCase) {}

  @Get(':cep')
  async getAddress(@Param() input: GetAddressInputDto): Promise<GetAddressOutputDto> {
    const result = await this.getAddressUseCase.execute({ cep: input.cep });
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
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      },
    );
  }
}
