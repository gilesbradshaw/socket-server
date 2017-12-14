import Rx from 'rxjs';
import compose from 'compose-function';
import config from './config';
import _socket from './branches/socket';
import sockets from './branches/sockets';
import opcServers from './branches/opcServers';
import _opcServer from './branches/opcServer';
import devices from './branches/devices';
import _device from './branches/device';
import _topic from './branches/topic';
import broadcasts from './branches/broadcasts';
import _broadcast from './branches/broadcast';
import trackingPoints from './branches/tracking-points';
import _trackingPoint from './branches/tracking-point';

const logCreator = name =>
  ({ key, path }) =>
    creater =>
      creater
        .do(
          created =>
            console.log({
              [name]: created,
              key,
              path,
            }),
      );

const socket = p =>
  compose(
    ...[
      logCreator('createdSocket'),
      _socket,
    ].map(f => f(p)),
  )();
const opcServer = p =>
  compose(
    ...[
      logCreator('createdOpcServer'),
      _opcServer,
    ].map(f => f(p)),
  )();
const device = p =>
  compose(
    ...[
      logCreator('createdDevice'),
      _device,
    ].map(f => f(p)),
  )();

const broadcast = p =>
  compose(
    ...[
      logCreator('createdBroadcast'),
      _broadcast,
    ].map(f => f(p)),
  )();

const trackingPoint = p =>
  compose(
    ...[
      logCreator('createdTrackingPoint'),
      _trackingPoint,
    ].map(f => f(p)),
  )();
const topic = p =>
  compose(
    ...[
      logCreator('createdTopic'),
      _topic,
    ].map(f => f(p)),
  )();

sockets({
  opcServers: compose(
    opcServers({
      devices: compose(
        devices({
          broadcasts: compose(
            broadcasts({
              broadcast,
              topic,
            }),
          ),
          device,
          mapper: ({ ...stuff }) =>
            ([
              broadcasts,
              trackingPoints,
            ]) => ({
              ...stuff,
              broadcasts,
              trackingPoints,
            }),
          trackingPoints: compose(
            trackingPoints({
              trackingPoint,
              topic,
            }),
          ),
        }),
      ),
      opcServer,
    }),
  ),
  socket,
})({
  configuration: config.sockets,
  path: [],
})
  .subscribe(xx => console.log(JSON.stringify({ xx }, null, 2)));

