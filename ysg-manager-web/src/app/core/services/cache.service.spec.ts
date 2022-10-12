import { CacheService } from './cache.service';
import { Tournament } from '../../types';

const TEST_STORAGE_KEY = 'ysg-tournaments-test';

describe('CacheService', () => {
  let service: CacheService;

  let tournament21: Tournament;
  let tournament22: Tournament;

  beforeEach(() => {
    tournament21 = { name: 'YSG 2021', dateDescription: '2021' } as Tournament;
    tournament22 = { name: 'YSG 2022', dateDescription: '2022' } as Tournament;

    service = new CacheService();

    localStorage.removeItem(TEST_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(TEST_STORAGE_KEY);
  });

  it('replaces the cache', () => {
    service.replaceCache([tournament21, tournament22], TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      { name: 'YSG 2021', dateDescription: '2021', isCached: true },
      { name: 'YSG 2022', dateDescription: '2022', isCached: true }
    ]);
  });

  it('adds an item to the cache', () => {
    service.addToCache(tournament21, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      { name: 'YSG 2021', dateDescription: '2021', isCached: true }
    ]);

    service.addToCache(tournament22, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      { name: 'YSG 2021', dateDescription: '2021', isCached: true },
      { name: 'YSG 2022', dateDescription: '2022', isCached: true }
    ]);
  });

  it('gets the items of the cache', () => {
    service.addToCache(tournament21, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      { name: 'YSG 2021', dateDescription: '2021', isCached: true }
    ]);
  });
});
