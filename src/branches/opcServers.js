import Rx from 'rxjs';

export default ({ devices, opcServer }) =>
  ({
    configuration,
    path,
    socket,
    ...rest
  }) =>
    Rx.Observable.combineLatest(
      Object.keys(configuration)
        .map(
          key =>
            opcServer({
              configuration: configuration[key].configuration,
              key,
              path,
            })
              .switchMap(
                opcServer =>
                  devices({
                    configuration: configuration[key].devices,
                    opcServer,
                    path: [...path, key],
                    socket,
                  })
                    .map(
                      devices => ({
                        configuration: configuration[key].configuration,
                        devices,
                        key,
                        path,
                        ...rest,
                      }),
                    ),
                ),
        ),
    );
