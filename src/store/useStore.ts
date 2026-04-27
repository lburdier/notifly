import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Media, Collection, Project, ArchiveEntry, Tag, AppSettings } from '../types'
import { mockMedia, mockCollections, mockProjects, mockArchives, allTags } from '../data/mock'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface Store {
  media: Media[]
  collections: Collection[]
  projects: Project[]
  archives: ArchiveEntry[]
  tags: Tag[]
  toasts: Toast[]
  selectedMediaIds: string[]
  appSettings: AppSettings

  // Media
  toggleFavorite: (id: string) => void
  setMediaStatus: (id: string, status: Media['status']) => void
  setMediaRating: (id: string, rating: number) => void
  deleteMedia: (id: string) => void
  addMedia: (media: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>) => void

  // Collections
  addCollection: (name: string, description?: string) => void
  deleteCollection: (id: string) => void
  addMediaToCollection: (collectionId: string, mediaIds: string[]) => void

  // Archives
  addArchive: (entry: Omit<ArchiveEntry, 'id' | 'archivedAt'>) => void
  deleteArchive: (id: string) => void

  // Selection
  toggleSelectMedia: (id: string) => void
  clearSelection: () => void

  // Settings
  updateAppSettings: (settings: Partial<AppSettings>) => void

  // Toast
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

// localStorage wrapper that swallows QuotaExceededError instead of crashing
const safeStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
        console.warn('[notifly] localStorage quota exceeded — background image or media library may be too large')
      }
    }
  },
  removeItem: (name: string) => {
    try { localStorage.removeItem(name) } catch { /* ignore */ }
  },
}))

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      media: mockMedia,
      collections: mockCollections,
      projects: mockProjects,
      archives: mockArchives,
      tags: allTags,
      toasts: [],
      selectedMediaIds: [],
      appSettings: {
        backgroundImage: undefined,
        blurAmount: 10,
        blurOpacity: 100,
      },

      toggleFavorite: (id) =>
        set((s) => ({
          media: s.media.map((m) =>
            m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
          ),
        })),

      setMediaStatus: (id, status) =>
        set((s) => ({
          media: s.media.map((m) => (m.id === id ? { ...m, status } : m)),
        })),

      setMediaRating: (id, rating) =>
        set((s) => ({
          media: s.media.map((m) => (m.id === id ? { ...m, rating } : m)),
        })),

      deleteMedia: (id) =>
        set((s) => ({
          media: s.media.filter((m) => m.id !== id),
          collections: s.collections.map((c) => ({
            ...c,
            mediaIds: c.mediaIds.filter((mid) => mid !== id),
          })),
        })),

      addMedia: (mediaData) =>
        set((s) => ({
          media: [
            {
              ...mediaData,
              id: `m${Date.now()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...s.media,
          ],
        })),

      addCollection: (name, description) =>
        set((s) => ({
          collections: [
            ...s.collections,
            {
              id: `c${Date.now()}`,
              name,
              description,
              mediaIds: [],
              tags: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      deleteCollection: (id) =>
        set((s) => ({
          collections: s.collections.filter((c) => c.id !== id),
        })),

      addMediaToCollection: (collectionId, mediaIds) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  mediaIds: [...new Set([...c.mediaIds, ...mediaIds])],
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),

      addArchive: (entry) =>
        set((s) => ({
          archives: [
            {
              ...entry,
              id: `a${Date.now()}`,
              archivedAt: new Date().toISOString(),
            },
            ...s.archives,
          ],
        })),

      deleteArchive: (id) =>
        set((s) => ({ archives: s.archives.filter((a) => a.id !== id) })),

      toggleSelectMedia: (id) =>
        set((s) => ({
          selectedMediaIds: s.selectedMediaIds.includes(id)
            ? s.selectedMediaIds.filter((i) => i !== id)
            : [...s.selectedMediaIds, id],
        })),

      clearSelection: () => set({ selectedMediaIds: [] }),

      updateAppSettings: (settings) =>
        set((s) => ({
          appSettings: { ...s.appSettings, ...settings },
        })),

      addToast: (message, type = 'success') => {
        const id = `t${Date.now()}`
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => get().removeToast(id), 3500)
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'notifly-v1',
      storage: safeStorage,
      // filePath contient le binaire brut (potentiellement 10-50 MB pour des vidéos)
      // on ne le persiste pas pour ne pas exploser le quota localStorage (5-10 MB).
      // thumbnailPath (miniature) est suffisant pour l'affichage en galerie.
      partialize: (state) => ({
        media: state.media.map(({ filePath: _f, ...rest }) => ({
          ...rest,
          filePath: '',
        })),
        collections: state.collections,
        projects: state.projects,
        archives: state.archives,
        tags: state.tags,
        appSettings: state.appSettings,
        // toasts et selectedMediaIds sont volontairement exclus (état éphémère)
      }),
    }
  )
)
