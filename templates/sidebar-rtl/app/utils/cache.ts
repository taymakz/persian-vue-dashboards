/**
 * Creates a simple expiring cache for memoization.
 *
 * This cache stores key-value pairs and automatically removes entries after a specified timeout.
 * Useful for caching results in functions like `useMemoize` where temporary caching is beneficial.
 *
 * @param timeout - The duration (in milliseconds) after which cached entries expire (default: 4000ms).
 * @returns An object with cache management methods: `get`, `set`, `has`, `delete`, and `clear`.
 */
export function createSimpleMemoizeExpiringCache(timeout = 4000) {
  const cache = new Map()

  return {
    /**
     * Retrieves a cached value by its key.
     *
     * @param key - The key associated with the cached value.
     * @returns The cached value if it exists, otherwise `undefined`.
     */
    get(key: string) {
      const entry = cache.get(key)
      return entry ? entry.value : undefined
    },

    /**
     * Stores a value in the cache with a given key.
     * The value automatically expires after the specified timeout.
     *
     * @param key - The key to store the value under.
     * @param value - The value to cache.
     */
    set(key: string, value: any) {
      cache.set(key, { value })
      setTimeout(() => cache.delete(key), timeout) // Automatically delete cache after timeout
    },

    /**
     * Checks if a key exists in the cache.
     *
     * @param key - The key to check for existence.
     * @returns `true` if the key exists, otherwise `false`.
     */
    has(key: string) {
      return cache.has(key)
    },

    /**
     * Deletes a specific key from the cache.
     *
     * @param key - The key to remove from the cache.
     */
    delete(key: string) {
      cache.delete(key)
    },

    /**
     * Clears all entries from the cache.
     */
    clear() {
      cache.clear()
    },
  }
}
