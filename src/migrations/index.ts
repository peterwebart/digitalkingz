import * as migration_20260810_003440_initial from './20260810_003440_initial';
import * as migration_20260902_031420_people_directory from './20260902_031420_people_directory';
import * as migration_20260918_034329_add_name_initial from './20260918_034329_add_name_initial';
import * as migration_20260918_040000_search_trigrams from './20260918_040000_search_trigrams';

export const migrations = [
  {
    up: migration_20260810_003440_initial.up,
    down: migration_20260810_003440_initial.down,
    name: '20260810_003440_initial',
  },
  {
    up: migration_20260902_031420_people_directory.up,
    down: migration_20260902_031420_people_directory.down,
    name: '20260902_031420_people_directory',
  },
  {
    up: migration_20260918_034329_add_name_initial.up,
    down: migration_20260918_034329_add_name_initial.down,
    name: '20260918_034329_add_name_initial'
  },
  {
    up: migration_20260918_040000_search_trigrams.up,
    down: migration_20260918_040000_search_trigrams.down,
    name: '20260918_040000_search_trigrams'
  },
];
