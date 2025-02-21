import { Test, TestingModule } from '@nestjs/testing';
import { AddressFinderOrchestrator } from 'src/infra/address-finders-orchestrator';
import { GetAddressUseCase } from '../get-address.usecase';
import { GetAddressInput } from 'src/application/dto/get-address.dto';
import { Address } from 'src/domain/value-object/address.value-object';

describe('GetAddressUseCase', () => {
  let getAddressUseCase: GetAddressUseCase;
  let addressFinderOrchestrator: jest.Mocked<AddressFinderOrchestrator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAddressUseCase,
        {
          provide: 'AddressFinderOrchestrator',
          useValue: {
            executeFind: jest.fn(),
          },
        },
      ],
    }).compile();

    getAddressUseCase = module.get<GetAddressUseCase>(GetAddressUseCase);
    addressFinderOrchestrator = module.get('AddressFinderOrchestrator');
  });

  describe('execute', () => {
    it('should return a valid address when the CEP is found', async () => {
      const input: GetAddressInput = { cep: '12345-678' };
      const mockAddress = Address.create({
        cep: '12345-678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
      });

      // Mock the orchestrator to return a valid address
      addressFinderOrchestrator.executeFind.mockResolvedValue(mockAddress);

      const result = await getAddressUseCase.execute(input);

      expect(result.isOk).toBe(true);
      expect(result.unwrap()).toEqual({
        cep: '12345678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
        fullAddress: 'Rua Principal, Centro, São Paulo, São Paulo, SP, CEP 12345-678',
      });
    });

    it('should return an error when the CEP is invalid', async () => {
      const input: GetAddressInput = { cep: 'invalid-cep' };
      const result = await getAddressUseCase.execute(input);
      expect(result.isErr).toBe(true);
    });

    it('should return an error when the orchestrator fails', async () => {
      const input: GetAddressInput = { cep: '12345-678' };
      // Mock the orchestrator to throw an error
      addressFinderOrchestrator.executeFind.mockRejectedValue(new Error('CEP not found'));
      const result = await getAddressUseCase.execute(input);
      expect(result.isErr).toBe(true);
    });
  });
});
