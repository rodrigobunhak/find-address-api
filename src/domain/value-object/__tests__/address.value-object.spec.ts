import { InvalidUFError } from 'src/domain/errors/domain.error';
import { Address } from '../address.value-object';
import { Cep } from '../cep.value-object';

describe('Address', () => {
  const validProps = {
    cep: '12345-678',
    uf: 'SP',
    state: 'São Paulo',
    city: 'São Paulo',
    neighborhood: 'Centro',
    street: 'Rua Principal',
  };

  describe('create', () => {
    it('should create an Address object with valid properties', () => {
      const address = Address.create(validProps);
      expect(address.cep).toBeInstanceOf(Cep);
      expect(address.uf).toBe('SP');
      expect(address.state).toBe('São Paulo');
      expect(address.city).toBe('São Paulo');
      expect(address.neighborhood).toBe('Centro');
      expect(address.street).toBe('Rua Principal');
    });

    it('should throw InvalidUFError for an invalid UF', () => {
      const invalidProps = { ...validProps, uf: 'XX' };
      expect(() => Address.create(invalidProps)).toThrow(InvalidUFError);
    });

    it('should convert UF to uppercase', () => {
      const address = Address.create({ ...validProps, uf: 'sp' });
      expect(address.uf).toBe('SP');
    });
  });

  describe('isValidUF', () => {
    it('should return true for a valid UF', () => {
      expect(Address['isValidUF']('SP')).toBe(true);
    });

    it('should return false for an invalid UF', () => {
      expect(Address['isValidUF']('XX')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(Address['isValidUF']('sp')).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return a formatted address string', () => {
      const address = Address.create(validProps);
      expect(address.toString()).toBe('Rua Principal, Centro, São Paulo, São Paulo, SP, CEP 12345-678');
    });
  });

  describe('toJSON', () => {
    it('should return the address properties as an object', () => {
      const address = Address.create(validProps);
      expect(address.toJSON()).toEqual({
        cep: '12345-678',
        uf: 'SP',
        state: 'São Paulo',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua Principal',
      });
    });
  });
});
