export type MediaType = 'image' | 'video' | 'gif' | 'archive'

export type MediaStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived'
  | 'unused'
  | 'to_clean'

export type Platform =
  | 'artstation'
  | 'instagram'
  | 'pinterest'
  | 'youtube'
  | 'vimeo'
  | 'behance'
  | 'web'
  | 'local'

export interface AppSettings {
  backgroundImage?: string // base64 or image path
  blurAmount: number // 0-20px
  blurOpacity: number // 0-100
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Media {
  id: string
  filename: string
  originalFilename: string
  type: MediaType
  mimeType: string
  filePath: string
  thumbnailPath: string
  sourceUrl?: string
  sizeBytes: number
  width?: number
  height?: number
  duration?: number
  rating: number
  isFavorite: boolean
  status: MediaStatus
  tags: Tag[]
  collectionIds: string[]
  projectId?: string
  notes?: string
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  coverMediaId?: string
  mediaIds: string[]
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  clientName?: string
  status: 'active' | 'completed' | 'archived'
  mediaIds: string[]
  createdAt: string
  updatedAt: string
}

export interface ArchiveEntry {
  id: string
  url: string
  platform: Platform
  title?: string
  description?: string
  thumbnailUrl?: string
  tags: Tag[]
  projectId?: string
  notes?: string
  archivedAt: string
}

export interface MediaAnalysis {
  id: string
  mediaId: string
  isHeavy: boolean
  isDuplicate: boolean
  isUnused: boolean
  isOrphaned: boolean
  optimizationSuggestion?: string
  analyzedAt: string
}

export interface RenamePreset {
  id: string
  name: string
  platform: string
  pattern: string
  example: string
}

export interface WatermarkPreset {
  id: string
  name: string
  text?: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  opacity: number
  size: number
}

export interface StorageStat {
  label: string
  bytes: number
  count: number
  color: string
}
