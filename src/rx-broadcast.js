// socket.read = client requests
export default ({ linx, socket }) =>
  socket
    .read()
    .switchMap(
      i => linx.read(i)
        .retry()
        .switchMap(
          r => linx.write(i)
            .retry()
            .switchMap(
              w => socket.write(w)
                .retry(),
            )
            .map(w => ({ i, r, w })),
        ),
    )
    .retry();
