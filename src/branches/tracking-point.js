// linx = plc requests
export default ({ socket, topic }) =>
  () =>
    topic
      .subscribe()
      .switchMap(
        i => socket
          .write(i)
          .retry()
          .switchMap(
            r => topic
              .write(r)
              .retry()
              .switchMap(
                w => socket
                  .write(w)
                  .retry(),
              )
              .map(w => ({ i, r, w })),
          ),
      )
      .retry();
