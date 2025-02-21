/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetAddressUseCase } from 'src/application/usecase/get-address.usecase';
import { InvalidCepError } from 'src/domain/errors/domain.error';
import { CepNotFoundError } from 'src/infra/errors/infra.error';
import { Result } from '@badrap/result';
import { GetAddressController } from '../get-address.controller';

describe('GetAddressController', () => {
  let app: INestApplication;
  let getAddressUseCase: jest.Mocked<GetAddressUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAddressController],
      providers: [
        {
          provide: GetAddressUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    getAddressUseCase = module.get(GetAddressUseCase);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /cep/:cep', () => {
    it('should return the address when the CEP is valid', async () => {
      const mockAddress = {
        cep: '12345-678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
        fullAddress: 'Rua Principal, Centro, São Paulo, São Paulo, SP, CEP 12345-678',
      };
      getAddressUseCase.execute.mockResolvedValue(Result.ok(mockAddress));
      const response = await request(app.getHttpServer()).get('/cep/12345-678').expect(200);
      expect(response.body).toEqual(mockAddress);
      expect(getAddressUseCase.execute).toHaveBeenCalledWith({ cep: '12345-678' });
    });

    it('should return 400 when the CEP is invalid', async () => {
      const cep = 'Invalid CEP';
      const invalidCepError = new InvalidCepError();
      getAddressUseCase.execute.mockResolvedValue(Result.err(invalidCepError));
      const response = await request(app.getHttpServer()).get(`/cep/${cep}`).expect(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: `Cep is not valid`,
      });
      expect(getAddressUseCase.execute).toHaveBeenCalledWith({ cep });
    });

    it('should return 404 when the CEP is not found', async () => {
      const cep = 'CEP not found';
      const cepNotFoundError = new CepNotFoundError();
      getAddressUseCase.execute.mockResolvedValue(Result.err(cepNotFoundError));
      const response = await request(app.getHttpServer()).get(`/cep/${cep}`).expect(404);
      expect(response.body).toEqual({
        statusCode: 404,
        message: `Cep not found`,
      });
      expect(getAddressUseCase.execute).toHaveBeenCalledWith({ cep });
    });

    it('should return 500 when an unexpected error occurs', async () => {
      const unexpectedError = new Error('Unexpected error');
      getAddressUseCase.execute.mockResolvedValue(Result.err(unexpectedError));
      const response = await request(app.getHttpServer()).get('/cep/12345-678').expect(500);
      expect(response.body).toEqual({
        statusCode: 500,
        message: 'Internal Server Error',
      });
      expect(getAddressUseCase.execute).toHaveBeenCalledWith({ cep: '12345-678' });
    });
  });
});
