export function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`
  return `${bytes} B`
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}

export function platformLabel(platform: string): string {
  const map: Record<string, string> = {
    artstation: 'ArtStation',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    behance: 'Behance',
    web: 'Web',
    local: 'Local',
  }
  return map[platform] ?? platform
}
