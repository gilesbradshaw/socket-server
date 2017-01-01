import Rx from 'rxjs';

export default ({ broadcast }) =>
  (config, socket, linx) =>
    Rx.Observable.combineLatest(
      Object.keys(config || {})
        .map(
          key =>
            broadcast({
              linx: linx(config[key].configuration),
              socket: socket(config[key].configuration),
            })
            .map(
              broadcast => ({
                broadcast,
                configuration: config[key].configuration,
                key,
              }),
            ),
          ),
    );
