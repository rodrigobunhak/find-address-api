/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AddressFinder } from 'src/domain/address-finder.provider';
import { Address } from 'src/domain/value-object/address.value-object';
import { AddressFinderOrchestrator } from '../address-finders-orchestrator';
import { CepNotFoundError } from '../errors/infra.error';

describe('AddressFinderOrchestrator', () => {
  let orchestrator: AddressFinderOrchestrator;
  let finder1: jest.Mocked<AddressFinder>;
  let finder2: jest.Mocked<AddressFinder>;
  let finder3: jest.Mocked<AddressFinder>;

  beforeEach(async () => {
    finder1 = {
      find: jest.fn(),
      next: finder2,
      getName: jest.fn(),
    };
    finder2 = {
      find: jest.fn(),
      next: finder3,
      getName: jest.fn(),
    };
    finder3 = {
      find: jest.fn(),
      next: undefined,
      getName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressFinderOrchestrator,
        {
          provide: 'AddressFinders',
          useValue: [finder1, finder2, finder3],
        },
      ],
    }).compile();

    orchestrator = module.get<AddressFinderOrchestrator>(AddressFinderOrchestrator);
  });

  describe('shuffleFinders', () => {
    it('should return a shuffled array of finders', () => {
      const finders = orchestrator['shuffleFinders']();
      expect(finders).toHaveLength(3);
      expect(finders).toContain(finder1);
      expect(finders).toContain(finder2);
      expect(finders).toContain(finder3);
    });
  });

  describe('buildChain', () => {
    it('should build a chain of finders', () => {
      const finders = [finder1, finder2, finder3];
      const chain = orchestrator['buildChain'](finders);

      expect(chain).toBe(finder1);
      expect(finder1.next).toBe(finder2);
      expect(finder2.next).toBe(finder3);
      expect(finder3.next).toBeUndefined();
    });
  });

  describe('executeFind', () => {
    it('should execute the find method on the first finder in the chain', async () => {
      const mockAddress = Address.create({
        cep: '12345-678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
      });
      finder1.find.mockResolvedValue(mockAddress);
      jest.spyOn(orchestrator as any, 'shuffleFinders').mockReturnValue([finder1, finder2, finder3]);
      const result = await orchestrator.executeFind('12345-678');
      expect(result).toStrictEqual(mockAddress);
      expect(finder1.find).toHaveBeenCalledWith('12345-678');
      expect(finder2.find).not.toHaveBeenCalled();
      expect(finder3.find).not.toHaveBeenCalled();
    });

    it('should fallback to the next finder if the first one fails', async () => {
      const mockAddress = Address.create({
        cep: '12345-678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
      });
      finder2.find.mockResolvedValue(mockAddress);
      finder1.find.mockResolvedValue(finder2.find('12345-678'));
      jest.spyOn(orchestrator as any, 'shuffleFinders').mockReturnValue([finder1, finder2, finder3]);
      const result = await orchestrator.executeFind('12345-678');
      expect(result).toEqual(mockAddress);
      expect(finder1.find).toHaveBeenCalledWith('12345-678');
      expect(finder2.find).toHaveBeenCalledWith('12345-678');
      expect(finder3.find).not.toHaveBeenCalled();
    });

    it('should throw an error if all finders fail', async () => {
      finder3.find.mockRejectedValue(new CepNotFoundError());
      finder2.find.mockResolvedValue(finder3.find('12345-678'));
      finder1.find.mockResolvedValue(finder2.find('12345-678'));
      jest.spyOn(orchestrator as any, 'shuffleFinders').mockReturnValue([finder1, finder2, finder3]);
      await expect(orchestrator.executeFind('12345-678')).rejects.toThrow(new CepNotFoundError());
      expect(finder1.find).toHaveBeenCalledWith('12345-678');
      expect(finder2.find).toHaveBeenCalledWith('12345-678');
      expect(finder3.find).toHaveBeenCalledWith('12345-678');
    });
  });
});
