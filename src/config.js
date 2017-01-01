export default {
  sockets: {
    socket: {
      configuration: 'socket-config',
      name: 'TMUK30',
      opcServers: {
        'rs-linx': {
          configuration: 'opc-server-config',
          devices: {
            aDevice: {
              broadcasts: {
                broadcast01: {
                  configuration: 'broadcast-01-config',
                },
              },
              configuration: 'device-config',
              'tracking-points': {
                'tracking-point01': {
                  configuration: 'tracking-point-01-config',
                },
              },
            },
          },
        },
      },
    },
  },
};
