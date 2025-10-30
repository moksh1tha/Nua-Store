import { Product } from '../types';

const API_BASE = 'https://fakestoreapi.com';
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class FakeStoreAPI {
  private cache: Map<string, CacheEntry<any>> = new Map();

  private getCacheKey(endpoint: string): string {
    return endpoint;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    localStorage.setItem(`cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
  }

  private loadCacheFromStorage(key: string): void {
    const stored = localStorage.getItem(`cache_${key}`);
    if (stored) {
      try {
        const entry = JSON.parse(stored);
        if (Date.now() - entry.timestamp < CACHE_DURATION) {
          this.cache.set(key, entry);
        } else {
          localStorage.removeItem(`cache_${key}`);
        }
      } catch (e) {
        localStorage.removeItem(`cache_${key}`);
      }
    }
  }

  async fetchProducts(): Promise<Product[]> {
    const cacheKey = this.getCacheKey('/products');
    this.loadCacheFromStorage(cacheKey);

    const cached = this.getFromCache<Product[]>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');

    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
  }

  async fetchProduct(id: number): Promise<Product> {
    const cacheKey = this.getCacheKey(`/products/${id}`);
    this.loadCacheFromStorage(cacheKey);

    const cached = this.getFromCache<Product>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');

    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
  }

  async fetchCategories(): Promise<string[]> {
    const cacheKey = this.getCacheKey('/categories');
    this.loadCacheFromStorage(cacheKey);

    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${API_BASE}/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');

    const data = await response.json();
    this.setCache(cacheKey, data);
    return data;
  }
}

export const fakeStoreAPI = new FakeStoreAPI();
