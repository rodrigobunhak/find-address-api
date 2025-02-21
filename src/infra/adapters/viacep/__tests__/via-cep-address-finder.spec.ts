/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/value-object/address.value-object';
import { CepNotFoundError } from 'src/infra/errors/infra.error';
import { of } from 'rxjs';
import { ViaCepAddressFinder } from '../via-cep-address-finder';
import { ViaCepResponseDTO } from '../via-cep-address-finder.dto';
import { AxiosResponse } from 'axios';

describe('ViaCepAddressFinder', () => {
  let viaCepAddressFinder: ViaCepAddressFinder;
  let httpService: jest.Mocked<HttpService>;
  let nextFinder: jest.Mocked<AddressFinder>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViaCepAddressFinder,
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

    viaCepAddressFinder = module.get<ViaCepAddressFinder>(ViaCepAddressFinder);
    httpService = module.get<HttpService>(HttpService) as jest.Mocked<HttpService>;
    nextFinder = module.get('AddressFinder') as jest.Mocked<AddressFinder>;
  });

  describe('find', () => {
    it('should return an address when the CEP is found', async () => {
      const mockResponse: ViaCepResponseDTO = {
        cep: '12345-678',
        uf: 'SP',
        estado: 'São Paulo',
        localidade: 'São Paulo',
        bairro: 'Centro',
        logradouro: 'Rua Principal',
        erro: false,
      };

      // Mock the HTTP response with all AxiosResponse properties
      const axiosResponse: AxiosResponse<ViaCepResponseDTO> = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://viacep.com.br/ws/12345-678/json/',
          headers: undefined,
        },
      };

      // Mock the HTTP response
      httpService.get.mockReturnValue(of(axiosResponse));

      const result = await viaCepAddressFinder.find('12345-678');

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
      expect(httpService.get).toHaveBeenCalledWith('https://viacep.com.br/ws/12345-678/json/');
    });

    it('should throw CepNotFoundError when the CEP is not found and there is no next finder', async () => {
      const mockResponse: ViaCepResponseDTO = {
        erro: true,
      };

      const axiosResponse: AxiosResponse<ViaCepResponseDTO> = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://viacep.com.br/ws/00000-000/json/',
          headers: undefined,
        },
      };

      httpService.get.mockReturnValue(of(axiosResponse));

      // Sobrescrever a propriedade `next` usando Object.defineProperty
      Object.defineProperty(viaCepAddressFinder, 'next', {
        value: undefined, // Define `next` como `undefined`
        writable: true, // Permite que a propriedade seja reatribuída
      });

      await expect(viaCepAddressFinder.find('00000-000')).rejects.toThrow(CepNotFoundError);
      expect(httpService.get).toHaveBeenCalledWith('https://viacep.com.br/ws/00000-000/json/');
    });

    it('should call the next finder when the CEP is not found', async () => {
      const mockResponse: ViaCepResponseDTO = {
        erro: true,
      };
      const axiosResponse: AxiosResponse<ViaCepResponseDTO> = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://viacep.com.br/ws/00000-000/json/',
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
      Object.defineProperty(viaCepAddressFinder, 'next', {
        value: nextFinder,
        writable: true,
      });
      const result = await viaCepAddressFinder.find('00000-000');
      expect(result).toEqual(mockAddress);
      expect(httpService.get).toHaveBeenCalledWith('https://viacep.com.br/ws/00000-000/json/');
      expect(nextFinder.find).toHaveBeenCalledWith('00000-000');
    });
  });

  describe('getName', () => {
    it('should return the correct name', () => {
      expect(viaCepAddressFinder.getName()).toBe('Via Cep');
    });
  });
});
