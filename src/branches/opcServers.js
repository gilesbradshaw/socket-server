import Rx from 'rxjs';

export default ({ devices, linx }) =>
  (config, socket) =>
    Rx.Observable.combineLatest(
      Object.keys(config)
        .map(
          key =>
            linx(config[key].configuration)
              .switchMap(
                linx =>
                  devices(config[key].devices, socket, linx)
                    .map(
                      devices => ({
                        configuration: config[key].configuration,
                        devices,
                        key,
                      }),
                    ),
                ),
        ),
    );
