import Rx from 'rxjs';

export default ({ trackingPoint }) =>
  (config, socket, linx) =>
    Rx.Observable.combineLatest(
      Object.keys(config || {})
        .map(
          key =>
            trackingPoint({
              linx: linx(config[key].configuration),
              socket: socket(config[key].configuration),
            })
            .map(
              trackingPoint => ({
                configuration: config[key].configuration,
                key,
                trackingPoint,
              }),
            ),
          ),
    );
