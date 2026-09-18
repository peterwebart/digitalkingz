import * as migration_20260810_003440_initial from './20260810_003440_initial';
import * as migration_20260902_031420_people_directory from './20260902_031420_people_directory';

export const migrations = [
  {
    up: migration_20260810_003440_initial.up,
    down: migration_20260810_003440_initial.down,
    name: '20260810_003440_initial',
  },
  {
    up: migration_20260902_031420_people_directory.up,
    down: migration_20260902_031420_people_directory.down,
    name: '20260902_031420_people_directory'
  },
];
