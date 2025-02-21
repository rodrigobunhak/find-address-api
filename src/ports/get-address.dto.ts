import { ApiProperty } from '@nestjs/swagger';
import { GetAddressInput, GetAddressOutput } from 'src/application/dto/get-address.dto';

export class GetAddressInputDto implements GetAddressInput {
  @ApiProperty({ example: '01001000' })
  cep: string;
}

export class GetAddressOutputDto implements GetAddressOutput {
  @ApiProperty()
  cep: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  neighborhood: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  fullAddress: string;
}
