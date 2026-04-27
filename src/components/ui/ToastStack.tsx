import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function ToastStack() {
  const { toasts, removeToast } = useStore()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-3 bg-bg-elevated border border-border px-4 py-3 min-w-[260px] max-w-sm"
          >
            {t.type === 'success' && <CheckCircle2 size={12} className="text-white flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle size={12} className="text-ink-3 flex-shrink-0" />}
            {t.type === 'info' && <Info size={12} className="text-ink-3 flex-shrink-0" />}
            <span className="font-mono text-[6.5pt] tracking-[0.08em] text-ink-2 flex-1">
              {t.message}
            </span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ink-6 hover:text-white transition-colors"
            >
              <X size={10} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
