import Rx from 'rxjs';


export default ({ socket, opcServers }) =>
  config =>
    Rx.Observable.combineLatest(
      Object.keys(config)
        .map(key =>
          socket(config[key].configuration)
            .switchMap(
              socket =>
                opcServers(config[key].opcServers, socket)
                  .map(
                    opcServers => ({
                      configuration: config[key].configuration,
                      key,
                      opcServers,
                    }),
                  ),
            ),
          ),
    );
