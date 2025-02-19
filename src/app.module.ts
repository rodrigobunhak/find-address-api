import { Module } from '@nestjs/common';
import { AddressModule } from './address.module';

@Module({
  imports: [AddressModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
