import Rx from 'rxjs';

export default () =>
  () =>
    Rx.Observable.of(
      () => ({
        read: () =>
          Rx.Observable
            .of('s-read')
            .delay(2000),
        subscribe: () =>
          Rx.Observable.interval(2000)
            .take(2)
            .map(
              x => `s-subed-${x}`,
            ),
        write: w =>
          Rx.Observable
            .of(w)
            .delay(10),
      }),
    );
