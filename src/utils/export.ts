import type { Media, Collection, ArchiveEntry } from '../types'
import { formatBytes, formatDate } from './format'

/**
 * Export data to JSON format for backup
 */
export function exportToJSON(data: any, filename: string = 'export.json') {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}

/**
 * Export media report to Markdown
 */
export function exportMediaToMarkdown(
  media: Media[],
  title: string = 'Media Report',
  collections: Collection[] = []
) {
  let md = `# ${title}\n\n`
  md += `Generated: ${formatDate(new Date().toISOString())}\n\n`
  
  // Summary stats
  const images = media.filter(m => m.type === 'image')
  const videos = media.filter(m => m.type === 'video')
  const favorites = media.filter(m => m.isFavorite)
  const totalBytes = media.reduce((a, m) => a + m.sizeBytes, 0)

  md += `## Summary\n\n`
  md += `- **Total Items**: ${media.length}\n`
  md += `- **Images**: ${images.length}\n`
  md += `- **Videos**: ${videos.length}\n`
  md += `- **Favorites**: ${favorites.length}\n`
  md += `- **Total Storage**: ${formatBytes(totalBytes)}\n\n`

  // Status breakdown
  const statusCounts = media.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  md += `## Status Breakdown\n\n`
  Object.entries(statusCounts).forEach(([status, count]) => {
    md += `- ${status}: ${count}\n`
  })
  md += `\n`

  // Detailed media list
  md += `## Media Details\n\n`
  media.forEach((item) => {
    md += `### ${item.filename}\n\n`
    md += `- **Type**: ${item.type}\n`
    md += `- **Status**: ${item.status}\n`
    md += `- **Size**: ${formatBytes(item.sizeBytes)}\n`
    md += `- **Rating**: ${item.rating}/5\n`
    md += `- **Favorite**: ${item.isFavorite ? 'Yes' : 'No'}\n`
    if (item.notes) md += `- **Notes**: ${item.notes}\n`
    if (item.tags.length > 0) {
      md += `- **Tags**: ${item.tags.map(t => t.name).join(', ')}\n`
    }
    md += `- **Created**: ${formatDate(item.createdAt)}\n`
    md += `\n`
  })

  downloadFile(md, `${title.toLowerCase().replace(/\s+/g, '-')}-report.md`, 'text/markdown')
}

/**
 * Export to PDF (using HTML to PDF conversion)
 */
export function exportToPDF(
  htmlContent: string,
  filename: string = 'export.pdf'
) {
  // Create a new window/iframe for printing
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    console.error('Could not open print window')
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { color: #0e0e0e; border-bottom: 2px solid #0e0e0e; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .n-card { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 10px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()

  // Use print dialog
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

/**
 * Export analytics report to Markdown
 */
export function exportAnalyticsToMarkdown(
  analytics: any,
  filename: string = 'analytics-report.md'
) {
  let md = `# Analytics Report\n\n`
  md += `Generated: ${formatDate(new Date().toISOString())}\n\n`

  md += `## Key Metrics\n\n`
  Object.entries(analytics).forEach(([key, value]) => {
    md += `- **${key}**: ${value}\n`
  })

  downloadFile(md, filename, 'text/markdown')
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const element = document.createElement('a')
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

/**
 * Export collections report
 */
export function exportCollectionsToMarkdown(
  collections: Collection[],
  media: Media[],
  filename: string = 'collections-report.md'
) {
  let md = `# Collections Report\n\n`
  md += `Generated: ${formatDate(new Date().toISOString())}\n\n`

  collections.forEach((collection) => {
    const collectionMedia = media.filter(m => collection.mediaIds.includes(m.id))
    const totalSize = collectionMedia.reduce((a, m) => a + m.sizeBytes, 0)

    md += `## ${collection.name}\n\n`
    if (collection.description) md += `${collection.description}\n\n`
    md += `- **Items**: ${collectionMedia.length}\n`
    md += `- **Total Size**: ${formatBytes(totalSize)}\n\n`

    md += `### Media\n\n`
    collectionMedia.forEach((item) => {
      md += `- ${item.filename} (${formatBytes(item.sizeBytes)})\n`
    })
    md += `\n`
  })

  downloadFile(md, filename, 'text/markdown')
}

/**
 * Save store data locally to localStorage
 */
export function saveToLocalStorage(storeData: any, key: string = 'notifly-backup') {
  try {
    localStorage.setItem(key, JSON.stringify(storeData))
    return true
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
    return false
  }
}

/**
 * Load store data from localStorage
 */
export function loadFromLocalStorage(key: string = 'notifly-backup') {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}
