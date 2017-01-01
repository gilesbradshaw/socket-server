import Rx from 'rxjs';

export default ({ broadcasts, trackingPoints }) =>
  (config, socket, linx) =>
    Rx.Observable.combineLatest(
      Object.keys(config)
        .map(
          key => linx(config[key].configuration)
            .switchMap(
              linx =>
                Rx.Observable.combineLatest(
                  broadcasts(
                    config[key].broadcasts,
                    socket,
                    linx,
                  ),
                  trackingPoints(
                    config[key]['tracking-points'],
                    socket,
                    linx,
                  ),
                )
                .map(
                  ([broadcasts, trackingPoints]) => ({
                    broadcasts,
                    configuration: config[key].configuration,
                    key,
                    trackingPoints,
                  }),
                ),
            ),
          ),
    );