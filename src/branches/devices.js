import Rx from 'rxjs';

export default ({
  broadcasts,
  device,
  mapper,
  trackingPoints,
}) =>
  ({
    configuration,
    opcServer,
    path,
    socket,
    ...rest
  }) =>
    Rx.Observable.combineLatest(
      Object.keys(configuration)
        .map(
          key => device({
            configuration: configuration[key].configuration,
            key,
            opcServer,
            path,
          })
            .switchMap(
              device =>
                Rx.Observable.combineLatest(
                  broadcasts({
                    configuration: configuration[key].broadcasts,
                    device,
                    path: [...path, key],
                    socket,
                  }),
                  trackingPoints({
                    configuration: configuration[key]['tracking-points'],
                    device,
                    path: [...path, key],
                    socket,
                  }),
                )
                .map(
                  ([broadcasts, trackingPoints]) => ({
                    broadcasts,
                    configuration: configuration[key].configuration,
                    key,
                    path,
                    trackingPoints,
                    ...rest,
                  }),
                ),
            ),
          ),
    );
