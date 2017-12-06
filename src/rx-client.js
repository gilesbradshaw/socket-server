import Rx from 'rxjs';
import net from 'net';



const client = () =>
  Rx.Observable.create((obs) => {
    const client = new net.Socket();
    client.connect(8124, '127.0.0.1', function() {
      console.log('Connected');
      client.write('Hello, server! Love, Client.');
    });
    
    client.on('data', (message) => {
      obs.next(message);
      client.destroy();
    });
    
    client.on('close', () => {
      obs.complete();
    });
    client.on('error', (error) => {
      obs.error(error);
    });
    return () => client.destroy();
  });

