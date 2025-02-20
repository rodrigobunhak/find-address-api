import { GetAddressInput, GetAddressOutput } from 'src/application/dto/get-address.dto';

export class GetAddressInputDto implements GetAddressInput {
  cep: string;
}

export class GetAddressOutputDto implements GetAddressOutput {
  cep: string;
  uf: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}
