import { HttpModule } from '@nestjs/axios';
import { GetAddressUseCase } from './application/usecase/get-address.usecase';
import { ViaCepAdapter } from './infra/apis/viacep/viacep.adapter';
import { BrasilApiAdapter } from './infra/apis/brasilapi/brasilapi.adapter';
import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';

@Module({
  imports: [HttpModule],
  controllers: [AddressController],
  providers: [
    GetAddressUseCase,
    {
      provide: 'ViaCepProvider',
      useClass: ViaCepAdapter,
    },
    {
      provide: 'BrasilApiProvider',
      useClass: BrasilApiAdapter,
    },
  ],
})
export class AddressModule {}
