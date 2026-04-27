import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Gallery from './pages/Gallery'
import Collections from './pages/Collections'
import Archive from './pages/Archive'
import Analysis from './pages/Analysis'
import Workflows from './pages/Workflows'
import Settings from './pages/Settings'
import MediaUpload from './pages/MediaUpload'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="media-upload" element={<MediaUpload />} />
          <Route path="collections" element={<Collections />} />
          <Route path="archive" element={<Archive />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
