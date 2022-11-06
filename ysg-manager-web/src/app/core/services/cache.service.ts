import { Injectable } from '@angular/core';
import { CacheSupport } from '../../types';
import { v4 as uuidv4 } from 'uuid';

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
    copiedItems.forEach((cached) => {
      cached.isCached = true;
      cached.cacheId = uuidv4();
    });

    localStorage.setItem(storageKey, JSON.stringify(copiedItems));
  }

  /**
   * Adds the given item to the cache.
   *
   * @param item the item to add to the cache
   * @param storageKey key of the cache
   */
  addToCache(item: CacheSupport, storageKey: string): void {
    const copiedItem: CacheSupport = JSON.parse(JSON.stringify(item));
    copiedItem.isCached = true;
    copiedItem.cacheId = uuidv4();

    let existingItems = this.getCache(storageKey);
    existingItems.push(copiedItem);

    localStorage.setItem(storageKey, JSON.stringify(existingItems));
  }

  /**
   * Removes the given item from the cache.
   *
   * @param item the item to remove from the cache
   * @param storageKey key of the cache
   */
  removeFromCache(item: CacheSupport, storageKey: string): void {
    let existingItems = this.getCache(storageKey);
    existingItems = existingItems.filter(
      (existingItem) => existingItem.cacheId !== item.cacheId
    );

    localStorage.setItem(storageKey, JSON.stringify(existingItems));
  }

  /**
   * Updates the given item in the cache.
   *
   * @param item the item to update in the cache
   * @param storageKey key of the cache
   */
  updateInCache(item: CacheSupport, storageKey: string): void {
    const copiedItem: CacheSupport = JSON.parse(JSON.stringify(item));

    let existingItems = this.getCache(storageKey);
    existingItems = existingItems.map((existingItem) =>
      existingItem.cacheId !== copiedItem.cacheId ? existingItem : copiedItem
    );

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
