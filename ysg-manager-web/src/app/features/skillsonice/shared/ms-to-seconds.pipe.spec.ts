import { MsToSecondsPipe } from './ms-to-seconds.pipe';

describe('MsToSecondsPipe', () => {
  let pipe: MsToSecondsPipe;

  beforeEach(() => {
    pipe = new MsToSecondsPipe();
  });

  it('transforms 0 milliseconds to "0.00"', () => {
    const result = pipe.transform(0);
    expect(result).toBe('0.00');
  });

  it('transforms 500 milliseconds to "0.50"', () => {
    const result = pipe.transform(500);
    expect(result).toBe('0.50');
  });

  it('transforms 1200 milliseconds to "1.20"', () => {
    const result = pipe.transform(1200);
    expect(result).toBe('1.20');
  });

  it('transforms 12345 milliseconds to "12.35"', () => {
    const result = pipe.transform(12345);
    expect(result).toBe('12.35');
  });

  it('transforms 12344 milliseconds to "12.34"', () => {
    const result = pipe.transform(12344);
    expect(result).toBe('12.34');
  });
});
