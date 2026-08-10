import * as migration_20260810_003440_initial from './20260810_003440_initial';

export const migrations = [
  {
    up: migration_20260810_003440_initial.up,
    down: migration_20260810_003440_initial.down,
    name: '20260810_003440_initial'
  },
];
