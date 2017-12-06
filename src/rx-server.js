import Rx from 'rxjs';
import net from 'net';

const connections$ = new Rx.Subject();

const server = net.createServer(c => connections$.next(c));
// Turn the connections themselves into an Observable

connections$
  // flatten the messages into their own Observable
  .flatMap(
    socket => Rx.Observable.fromEvent(socket, 'data')
      // Handle the socket closing as well
      .takeUntil(Rx.Observable.fromEvent(socket, 'close')),
    (socket, msg) => (
      // Transform each message to include the socket as well.
      {
        socket,
        data: msg,
      }
    ),
  )
  .flatMap(({ data, socket }) =>
    Rx.Observable
      .bindCallback(socket.write)
      .bind(socket)(data)
      .map(
        () => ({
          data,
          socket,
        }),
      ),
  )
  .subscribe(
    m => console.log({ m }),
    err => console.log(err),
  );

server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
