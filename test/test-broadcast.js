import 'rxjs';
import { should } from 'chai';
import { marbles } from 'rxjs-marbles';
import sinon from 'sinon';
import broadcast from '../src/rx-broadcast';


should();

describe('Server', () => {
  describe('broadcast', () => {
    it('should', marbles((m) => {
      const linx = {
        read: sinon.spy(
          () => m.cold('-(1|'),
        ),
        write: sinon.spy(
          () => m.cold('-(a|'),
        ),
      };
      const socket = {
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        broadcast({ linx, socket }),
      ).toBeObservable(
        '----(*|',
        {
          '*': {
            i: 'B',
            r: '1',
            w: 'A',
          },
        },
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B']]);
      socket.write.args.should.eql([['a']]);
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
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        broadcast({ linx, socket }),
      ).toBeObservable(
        '----(@|',
        {
          '@': {
            i: 'B',
            r: '2',
            w: 'A',
          },
        },
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B'], ['B']]);
      socket.write.args.should.eql([['a:B']]);
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
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        broadcast({ linx, socket }),
      ).toBeObservable(
        '----*---(@|',
        {
          '*': {
            i: 'B',
            r: '1',
            w: 'A',
          },
          '@': {
            i: 'B',
            r: '2',
            w: 'A',
          },
        },
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B'], ['B']]);
      socket.write.args.should.eql([['a:B'], ['a:B']]);
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
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.spy(
          () => m.cold('-(A|'),
        ),
      };
      m.expect(
        broadcast({ linx, socket })
          .take(2),
      ).toBeObservable(
        '----*----(*|',
        {
          '*': {
            i: 'B',
            r: '1',
            w: 'A',
          },
        },
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B'], ['B']]);
      socket.write.args.should.eql([['a'], ['a']]);
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
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.spy(
          () => m.cold('-#'),
        ),
      };
      m.expect(
        broadcast({ linx, socket }),
      ).toBeObservable(
        '-',
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B']]);
      socket.write.args.should.eql([['a:B']]);
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
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.spy(
          () => m.cold('-A'),
        ),
      };
      m.expect(
        broadcast({ linx, socket }),
      ).toBeObservable(
        '----',
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B']]);
      socket.write.args.should.eql([]);
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
        read: sinon.spy(
          () => m.cold('-(B|'),
        ),
        write: sinon.stub()
          .onCall(0)
          .returns(m.cold('-A|'))
          .onCall(1)
          .returns(m.cold('-#')),
      };
      m.expect(
        broadcast({ linx, socket }),
      ).toBeObservable(
        '----1',
        {
          1: {
            i: 'B',
            r: '1',
            w: 'A',
          },
        },
      );
      m.flush();
      socket.read.args.should.eql([[]]);
      linx.read.args.should.eql([['B']]);
      linx.write.args.should.eql([['B']]);
      socket.write.args.should.eql([['a']]);
    }));
  });
});
