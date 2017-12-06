import { expect } from 'chai';
import server from '../src/server';

describe('Sever', () => {

  describe('subscribe', () => {

    it('should return welcome message for a guest user', (done) => {
      server().toArray().subscribe((result) => {
        expect(result).to.eql([1, 2, 3, 4, 5]);
        done();
      });
    });

  });

});
