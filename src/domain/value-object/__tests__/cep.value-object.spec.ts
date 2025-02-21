import { InvalidCepError } from 'src/domain/errors/domain.error';
import { Cep } from '../cep.value-object';

describe('Cep', () => {
  describe('create', () => {
    it('should create a Cep object with a valid CEP', () => {
      const validCep = '12345-678';
      const cep = Cep.create(validCep);
      expect(cep.value).toBe('12345678');
    });

    it('should throw InvalidCepError for an invalid CEP format', () => {
      const invalidCep = '1234-567';
      expect(() => Cep.create(invalidCep)).toThrow(InvalidCepError);
    });

    it('should throw InvalidCepError for a CEP with all digits equal', () => {
      const invalidCep = '11111111';
      expect(() => Cep.create(invalidCep)).toThrow(InvalidCepError);
    });

    it('should throw InvalidCepError for a CEP with all zeros', () => {
      const invalidCep = '00000000';
      expect(() => Cep.create(invalidCep)).toThrow(InvalidCepError);
    });

    it('should throw InvalidCepError for a CEP with non-numeric characters', () => {
      const invalidCep = '12345-67a';
      expect(() => Cep.create(invalidCep)).toThrow(InvalidCepError);
    });
  });

  describe('toString', () => {
    it('should return a formatted CEP string', () => {
      const cep = Cep.create('12345678');
      expect(cep.toString()).toBe('12345-678');
    });

    it('should return a formatted CEP string even if input is already formatted', () => {
      const cep = Cep.create('12345-678');
      expect(cep.toString()).toBe('12345-678');
    });
  });

  describe('isValidCep', () => {
    it('should return true for a valid CEP', () => {
      const validCep = '12345-678';
      expect(Cep['isValidCep'](validCep)).toBe(true);
    });

    it('should return false for an invalid CEP format', () => {
      const invalidCep = '1234-567';
      expect(Cep['isValidCep'](invalidCep)).toBe(false);
    });

    it('should return false for a CEP with all digits equal', () => {
      const invalidCep = '11111111';
      expect(Cep['isValidCep'](invalidCep)).toBe(false);
    });

    it('should return false for a CEP with all zeros', () => {
      const invalidCep = '00000000';
      expect(Cep['isValidCep'](invalidCep)).toBe(false);
    });

    it('should return false for a CEP with non-numeric characters', () => {
      const invalidCep = '12345-67a';
      expect(Cep['isValidCep'](invalidCep)).toBe(false);
    });
  });

  describe('formatCep', () => {
    it('should remove non-numeric characters from the CEP', () => {
      const cep = '12345-678';
      expect(Cep['formatCep'](cep)).toBe('12345678');
    });

    it('should return the same CEP if it contains only numbers', () => {
      const cep = '12345678';
      expect(Cep['formatCep'](cep)).toBe('12345678');
    });
  });
});
