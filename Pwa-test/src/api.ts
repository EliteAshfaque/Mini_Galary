import { readCache, writeCache } from './lib/cache'
import type { Person, Photo, Post } from './types'

const PICSUM = 'https://picsum.photos'
const PLACEHOLDER = 'https://jsonplaceholder.typicode.com'

async function fetchJson<T>(url: string, cacheKey: string): Promise<T> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = (await response.json()) as T
    writeCache(cacheKey, data)
    return data
  } catch (error) {
    const cached = readCache<T>(cacheKey)
    if (cached) return cached
    throw error
  }
}

export function photoThumb(id: string, width = 400, height = 280): string {
  return `${PICSUM}/id/${id}/${width}/${height}`
}

export function photoFull(id: string, width = 900, height = 640): string {
  return `${PICSUM}/id/${id}/${width}/${height}`
}

export function postCover(id: number): string {
  return `${PICSUM}/seed/post-${id}/640/360`
}

export function avatarUrl(id: number): string {
  return `https://i.pravatar.cc/128?u=${id}`
}

export function fetchPhotos(limit = 24): Promise<Photo[]> {
  return fetchJson<Photo[]>(`${PICSUM}/v2/list?page=2&limit=${limit}`, 'photos-p2')
}

export function fetchPosts(): Promise<Post[]> {
  return fetchJson<Post[]>(`${PLACEHOLDER}/posts?_limit=18`, 'posts')
}

export function fetchPeople(): Promise<Person[]> {
  return fetchJson<Person[]>(`${PLACEHOLDER}/users`, 'people')
}
