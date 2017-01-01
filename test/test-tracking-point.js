
import 'rxjs';
import { should } from 'chai';
import { marbles } from 'rxjs-marbles';
import sinon from 'sinon';
import trackingPoint from '../src/rx-tracking-point';

should();

describe('Server', () => {
  describe('tracking-point', () => {
    it('should!', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-(1|'),
        ),
        write: sinon.spy(
          () => m.cold('-(a|'),
        ),
      };
      const socket = {
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        trackingPoint({ linx, socket }),
      ).toBeObservable(
        '----(*|',
        {
          '*': {
            i: '1',
            r: 'A',
            w: 'A',
          },
        },
      );
      m.flush();
      linx.read.args.should.eql([[]]);
      linx.write.args.should.eql([['A']]);
      socket.write.args.should.eql([['1'], ['a']]);
    }));
    it('should switch linx\'s', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-(12|'),
        ),
        write: sinon.spy(
          a => m.cold('-(a|', { a: `a:${a}`}),
        ),
      };
      const socket = {
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        trackingPoint({ linx, socket }),
      ).toBeObservable(
        '----(@|',
        {
          '@': {
            i: '2',
            r: 'A',
            w: 'A',
          },
        },
      );
      m.flush();
      linx.read.args.should.eql([[]]);
      linx.write.args.should.eql([['A']]);
      socket.write.args.should.eql([['1'], ['2'], ['a:A']]);
    }));
    it('should switch linx\'s 2', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-1---2|'),
        ),
        write: sinon.spy(
          a => m.cold('-(a|', { a: `a:${a}`}),
        ),
      };
      const socket = {
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        trackingPoint({ linx, socket }),
      ).toBeObservable(
        '----*---(@|',
        {
          '*': {
            i: '1',
            r: 'A',
            w: 'A',
          },
          '@': {
            i: '2',
            r: 'A',
            w: 'A',
          },
        },
      );
      m.flush();
      linx.read.args.should.eql([[]]);
      linx.write.args.should.eql([['A'], ['A']]);
      socket.write.args.should.eql([['1'], ['a:A'], ['2'], ['a:A']]);
    }));
    it('should repeat linx on fail', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-1---#'),
        ),
        write: sinon.spy(
          () => m.cold('-(a|'),
        ),
      };
      const socket = {
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        trackingPoint({ linx, socket })
          .take(2),
      ).toBeObservable(
        '----*----(*|',
        {
          '*': {
            i: '1',
            r: 'A',
            w: 'A',
          },
        },
      );
      m.flush();
      linx.read.args.should.eql([[]]);
      linx.write.args.should.eql([['A'], ['A']]);
      socket.write.args.should.eql([['1'], ['a'], ['1'], ['a']]);
    }));
    it('should catch socket write fail', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-1'),
        ),
        write: sinon.spy(
          a => m.cold('-(a|', { a: `a:${a}`}),
        ),
      };
      const socket = {
        write: sinon.spy(
          () => m.cold('-#'),
        ),
      };
      m.expect(
        trackingPoint({ linx, socket }),
      ).toBeObservable(
        '-',
      );
      m.flush();
      linx.read.args.should.eql([[]], 'read');
      linx.write.args.should.eql([], 'write');
      socket.write.args.should.eql([['1']], 'write');
    }));
    it('should catch linx write fail', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-1'),
        ),
        write: sinon.spy(
          () => m.cold('-#'),
        ),
      };
      const socket = {
        write: sinon.spy(
          () => m.cold('-A'),
        ),
      };
      m.expect(
        trackingPoint({ linx, socket }),
      ).toBeObservable(
        '----',
      );
      m.flush();
      linx.read.args.should.eql([[]], 'read');
      linx.write.args.should.eql([['A']], 'write');
      socket.write.args.should.eql([['1']], 'write');
    }));
    it('should catch second write fail', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-1'),
        ),
        write: sinon.spy(
          () => m.cold('-a'),
        ),
      };
      const socket = {
        write: sinon.stub()
          .onCall(0)
          .returns(m.cold('-A|'))
          .onCall(1)
          .returns(m.cold('-#')),
      };
      m.expect(
        trackingPoint({ linx, socket }),
      ).toBeObservable(
        '----',
      );
      m.flush();
      linx.read.args.should.eql([[]], 'read');
      linx.write.args.should.eql([['A']], 'write');
      socket.write.args.should.eql([['1'], ['a']], 'socket write');
    }));
  });
});
