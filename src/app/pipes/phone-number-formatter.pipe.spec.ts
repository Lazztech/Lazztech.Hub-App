import { PhoneNumberFormatterPipe } from './phone-number-formatter.pipe';

describe('PhoneNumberFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new PhoneNumberFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
