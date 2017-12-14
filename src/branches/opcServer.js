import Rx from 'rxjs';

export default () =>
  () =>
    Rx.Observable.of(
      () => ({
        opcServer: 'opcServer',
      }),
    );
