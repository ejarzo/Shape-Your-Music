import { expect } from 'chai';

describe('1+1', () => {
  let sum = 1+1;

  it('should be 2', () => {
    expect(sum).to.equal(2);
  });
});

describe('This is just a test', () => {
  const str = 'Marifel';
  it('should not match the string', () => {
    expect(str).to.not.equal('derek');
  });
})
