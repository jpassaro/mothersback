import mothersback from '../../src/mothersback';

describe('mothersback', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(mothersback, 'greet');
      mothersback.greet();
    });

    it('should have been run once', () => {
      expect(mothersback.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(mothersback.greet).to.have.always.returned('hello');
    });
  });
});
