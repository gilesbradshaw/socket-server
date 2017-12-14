import Rx from 'rxjs';

export default () =>
  () =>
    Rx.Observable.of({
      read: () =>
        Rx.Observable
          .of('p-read')
          .delay(1000),
      subscribe: () =>
        Rx.Observable.interval(2000)
          .take(3)
          .switchMap(
            x =>
              Rx.Observable
                .of(`p-subed-${x}`),
          ),
      write: w =>
        Rx.Observable.of(w)
          .delay(10),
    });

