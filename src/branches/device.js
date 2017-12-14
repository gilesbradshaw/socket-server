import Rx from 'rxjs';

export default () =>
  () =>
    Rx.Observable.of(
      () => ({
        read: () => Rx.Observable
          .of('p-read')
          .delay(10),
        write: w =>
          Rx.Observable.of(w)
            .delay(10),
      }),
    );
