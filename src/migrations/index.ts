import * as migration_20260810_012850 from './20260810_012850';

export const migrations = [
  {
    up: migration_20260810_012850.up,
    down: migration_20260810_012850.down,
    name: '20260810_012850'
  },
];
