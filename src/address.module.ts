import { HttpModule } from '@nestjs/axios';
import { GetAddressUseCase } from './application/usecase/get-address.usecase';
import { Module } from '@nestjs/common';
import { BrasilApiAddressFinder } from './infra/adapters/brasilapi/brasil-api-address-finder';
import { ViaCepAddressFinder } from './infra/adapters/viacep/via-cep-address-finder';
import { AddressFinderOrchestrator } from './infra/address-finders-orchestrator';
import { GetAddressController } from './ports/get-address.controller';

@Module({
  imports: [HttpModule],
  controllers: [GetAddressController],
  providers: [
    GetAddressUseCase,
    BrasilApiAddressFinder,
    ViaCepAddressFinder,
    {
      provide: 'AddressFinders',
      useFactory: (viaCep: ViaCepAddressFinder, brasilCep: BrasilApiAddressFinder) => [viaCep, brasilCep],
      inject: [ViaCepAddressFinder, BrasilApiAddressFinder],
    },
    {
      provide: 'AddressFinderOrchestrator',
      useClass: AddressFinderOrchestrator,
    },
  ],
})
export class AddressModule {}
