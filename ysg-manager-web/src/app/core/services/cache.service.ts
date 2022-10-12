import { Injectable } from '@angular/core';
import { CacheSupport } from '../../types';

/**
 * Service to store items in the local storage cache.
 * Type of cached items must inherit from type CacheSupport.
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  /**
   * Replaces the whole cache with the items passed as parameter.
   *
   * @param items items to put into the cache (existing items will be replaced)
   * @param storageKey key of the cache
   */
  replaceCache(items: CacheSupport[], storageKey: string): void {
    const copiedItems: CacheSupport[] = JSON.parse(JSON.stringify(items));
    copiedItems.forEach((cached) => (cached.isCached = true));

    localStorage.setItem(storageKey, JSON.stringify(copiedItems));
  }

  /**
   * Adds the given item to the cache.
   *
   * @param item the item to add to the cache
   * @param storageKey key of the cache
   */
  addToCache(item: any, storageKey: string): void {
    const copiedItem: CacheSupport = JSON.parse(JSON.stringify(item));
    copiedItem.isCached = true;

    let existingItems = this.getCache(storageKey);
    existingItems.push(copiedItem);

    localStorage.setItem(storageKey, JSON.stringify(existingItems));
  }

  /**
   * Returns all items which are currently in the cache.
   *
   * @param storageKey key of the cache
   * @return the cache for the given key
   */
  getCache(storageKey: string): any[] {
    let existingValue = localStorage.getItem(storageKey);
    return existingValue ? JSON.parse(existingValue) : [];
  }
}
