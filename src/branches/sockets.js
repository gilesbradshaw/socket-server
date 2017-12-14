import Rx from 'rxjs';

export default ({ socket, opcServers }) =>
  ({
    configuration,
    path,
    ...rest
  }) =>
    Rx.Observable.combineLatest(
      Object.keys(configuration)
        .map(key =>
          socket({
            configuration: configuration[key].configuration,
            key,
            path,
          })
            .switchMap(
              socket =>
                opcServers({
                  configuration: configuration[key].opcServers,
                  path: [...path, key],
                  socket,
                })
                  .map(
                    opcServers => ({
                      configuration: configuration[key].configuration,
                      key,
                      opcServers,
                      path,
                      ...rest,
                    }),
                  ),
            ),
          ),
    );
