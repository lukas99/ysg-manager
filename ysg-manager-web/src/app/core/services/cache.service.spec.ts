import { CacheService } from './cache.service';
import { Tournament } from '../../types';
import * as uuid from 'uuid';

jest.mock('uuid');

const TEST_STORAGE_KEY = 'ysg-tournaments-test';

describe('CacheService', () => {
  let service: CacheService;

  let tournament21: Tournament;
  let tournament22: Tournament;
  let tournament21FromCache: Tournament;
  let tournament22FromCache: Tournament;

  beforeEach(() => {
    const uuidSpy = jest.spyOn(uuid, 'v4');
    uuidSpy.mockReturnValueOnce('1111').mockReturnValueOnce('2222');

    tournament21 = { name: 'YSG 2021', dateDescription: '2021' } as Tournament;
    tournament22 = { name: 'YSG 2022', dateDescription: '2022' } as Tournament;
    tournament21FromCache = {
      name: 'YSG 2021',
      dateDescription: '2021',
      isCached: true,
      cacheId: '1111'
    } as Tournament;
    tournament22FromCache = {
      name: 'YSG 2022',
      dateDescription: '2022',
      isCached: true,
      cacheId: '2222'
    } as Tournament;

    service = new CacheService();

    localStorage.removeItem(TEST_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(TEST_STORAGE_KEY);
  });

  it('replaces the cache', () => {
    service.replaceCache([tournament21, tournament22], TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      },
      {
        name: 'YSG 2022',
        dateDescription: '2022',
        isCached: true,
        cacheId: '2222'
      }
    ]);
  });

  it('adds an item to the cache', () => {
    service.addToCache(tournament21, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      }
    ]);

    service.addToCache(tournament22, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      },
      {
        name: 'YSG 2022',
        dateDescription: '2022',
        isCached: true,
        cacheId: '2222'
      }
    ]);
  });

  it('removes an item from the cache', () => {
    service.replaceCache([tournament21, tournament22], TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      },
      {
        name: 'YSG 2022',
        dateDescription: '2022',
        isCached: true,
        cacheId: '2222'
      }
    ]);

    service.removeFromCache(tournament21FromCache, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2022',
        dateDescription: '2022',
        isCached: true,
        cacheId: '2222'
      }
    ]);
  });

  it('updates an item in the cache', () => {
    service.replaceCache([tournament21, tournament22], TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      },
      {
        name: 'YSG 2022',
        dateDescription: '2022',
        isCached: true,
        cacheId: '2222'
      }
    ]);

    tournament22FromCache.dateDescription = '22';

    service.updateInCache(tournament22FromCache, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      },
      {
        name: 'YSG 2022',
        dateDescription: '22',
        isCached: true,
        cacheId: '2222'
      }
    ]);
  });

  it('gets the items of the cache', () => {
    service.addToCache(tournament21, TEST_STORAGE_KEY);
    expect(service.getCache(TEST_STORAGE_KEY)).toMatchObject([
      {
        name: 'YSG 2021',
        dateDescription: '2021',
        isCached: true,
        cacheId: '1111'
      }
    ]);
  });
});
