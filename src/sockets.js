import { Observable, Subject } from 'rxjs/Rx';
import net from 'net';

console.log('socket server');

const createSubject = () => {
    return Observable.create((observer) => {
      const socket = net.connect({port: 1705}, () => {
  
        console.log('Connected to Server!');
  
        let socketObservable = Observable.create((observer) => {
          socket.on('data', (data) => observer.next(JSON.parse(data)));
          socket.on('error', (err) => observer.error(err));
          socket.on('close', () => observer.complete());
        });
  
        let socketObserver = {
          next: (data) => {
            if (!socket.destroyed) {
              console.log('write data', data);
              socket.write(`${JSON.stringify(data)}\r\n`);
            }
          }
        };
  
        const subject = Subject.create(socketObserver, socketObservable);
        observer.next(subject);
        observer.complete();
  
      });
  
    });
  
  };

const s = createSubject();

s.subscribe((data) => {
  data.subscribe(d => console.log({ d }));
  console.log(data);
  data.next({ jah: 'wobble' });
});
