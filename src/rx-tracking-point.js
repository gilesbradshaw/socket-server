// linx = plc requests
export default ({ linx, socket }) =>
  linx
    .read()
    .switchMap(
      i => socket
        .write(i)
        .retry()
        .switchMap(
          r => linx
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
