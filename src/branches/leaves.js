import Rx from 'rxjs';

export default title =>
  ({
    [title]: broadcast,
    topic,
  }) =>
    ({
      configuration,
      device,
      path,
      socket,
      ...rest
    }) =>
      Rx.Observable.combineLatest(
        Object.keys(configuration || {})
          .map(
            key =>
              topic({
                configuration: configuration[key].configuration,
                device,
                key,
                path,
              })
                .switchMap(topic =>
                  broadcast(
                    {
                      key,
                      path,
                      socket: socket(
                        configuration[key].configuration,
                      ),
                      topic,
                    },
                  ),
                )
                .map(
                  broadcast => ({
                    [title]: broadcast,
                    configuration: configuration[key].configuration,
                    key,
                    path,
                    ...rest,
                  }),
                ),
              ),
      );
