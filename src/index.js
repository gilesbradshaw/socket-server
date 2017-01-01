import Rx from 'rxjs';
import config from './config';
import broadcast from './rx-broadcast';
import trackingPoint from './rx-tracking-point';
import sockets from './branches/sockets';
import opcServers from './branches/opcServers';
import devices from './branches/devices';
import trackingPoints from './branches/trackingPoints';
import broadcasts from './branches/broadcasts';

const socket = () =>
  Rx.Observable.of(
    () => ({
      read: () =>
        Rx.Observable
          .of('s-read')
          .concat(Rx.Observable.of('s-read-2').delay(2000)),
      write: w => Rx.Observable.of(w).delay(10),
    }),
  );

const linx = () =>
  Rx.Observable.of(
    () =>
      Rx.Observable.of(
        () => ({
          read: () => Rx.Observable.of('p-read').delay(10),
          write: w => Rx.Observable.of(w).delay(10),
        }),
    ),
  );


sockets({
  opcServers: opcServers({
    devices: devices({
      broadcasts: broadcasts({
        broadcast,
      }),
      trackingPoints: trackingPoints({
        trackingPoint,
      }),
    }),
    linx,
  }),
  socket,
})(config.sockets)
  .subscribe(x => console.log(JSON.stringify(x, null, 2)));
