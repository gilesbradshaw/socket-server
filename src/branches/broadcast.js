// socket.read = client requests
export default ({ socket, topic }) =>
  () =>
    socket
      .subscribe()
      .switchMap(
        i => topic.read(i)
          .retry()
          .switchMap(
            r => topic.write(i)
              .retry()
              .switchMap(
                w => socket.write(w)
                  .retry(),
              )
              .map(w => ({ i, r, w })),
          ),
      )
      .retry();
