/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/value-object/address.value-object';
import { CepNotFoundError } from 'src/infra/errors/infra.error';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BrasilApiAddressFinder } from '../brasil-api-address-finder';
import { BrasilApiResponseDTO } from '../brasil-api-address-finder.dto';

describe('BrasilApiAddressFinder', () => {
  let brasilApiAddressFinder: BrasilApiAddressFinder;
  let httpService: jest.Mocked<HttpService>;
  let nextFinder: jest.Mocked<AddressFinder>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrasilApiAddressFinder,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'AddressFinder',
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    brasilApiAddressFinder = module.get<BrasilApiAddressFinder>(BrasilApiAddressFinder);
    httpService = module.get<HttpService>(HttpService) as jest.Mocked<HttpService>;
    nextFinder = module.get('AddressFinder') as jest.Mocked<AddressFinder>;
  });

  describe('find', () => {
    it('should return an address when the CEP is found', async () => {
      const mockResponse: BrasilApiResponseDTO = {
        cep: '12345-678',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
        service: 'service',
      };
      const axiosResponse: AxiosResponse<BrasilApiResponseDTO> = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://brasilapi.com.br/api/cep/v1/12345-678',
          headers: undefined,
        },
      };
      httpService.get.mockReturnValue(of(axiosResponse));
      const result = await brasilApiAddressFinder.find('12345-678');
      expect(result).toBeInstanceOf(Address);
      expect(result).toEqual(
        Address.create({
          cep: '12345-678',
          uf: 'SP',
          state: 'São Paulo',
          city: 'São Paulo',
          neighborhood: 'Centro',
          street: 'Rua Principal',
        }),
      );
      expect(httpService.get).toHaveBeenCalledWith('https://brasilapi.com.br/api/cep/v1/12345-678');
    });

    it('should throw CepNotFoundError when the CEP is not found and there is no next finder', async () => {
      const axiosResponse: AxiosResponse<BrasilApiResponseDTO> = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://brasilapi.com.br/api/cep/v1/00000-000',
          headers: undefined,
        },
      };
      httpService.get.mockReturnValue(of(axiosResponse));
      Object.defineProperty(brasilApiAddressFinder, 'next', {
        value: undefined,
        writable: true,
      });
      await expect(brasilApiAddressFinder.find('00000-000')).rejects.toThrow(CepNotFoundError);
      expect(httpService.get).toHaveBeenCalledWith('https://brasilapi.com.br/api/cep/v1/00000-000');
    });

    it('should call the next finder when the CEP is not found', async () => {
      const axiosResponse: AxiosResponse<BrasilApiResponseDTO> = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://brasilapi.com.br/api/cep/v1/00000-000',
          headers: undefined,
        },
      };
      httpService.get.mockReturnValue(of(axiosResponse));
      const mockAddress = Address.create({
        cep: '12345-678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
      });
      nextFinder.find.mockResolvedValue(mockAddress);
      Object.defineProperty(brasilApiAddressFinder, 'next', {
        value: nextFinder,
        writable: true,
      });
      const result = await brasilApiAddressFinder.find('00000-000');
      expect(result).toEqual(mockAddress);
      expect(httpService.get).toHaveBeenCalledWith('https://brasilapi.com.br/api/cep/v1/00000-000');
      expect(nextFinder.find).toHaveBeenCalledWith('00000-000');
    });
  });

  describe('getName', () => {
    it('should return the correct name', () => {
      expect(brasilApiAddressFinder.getName()).toBe('Brasil Cep');
    });
  });
});
