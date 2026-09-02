import { Loader2 } from 'lucide-react'

// [State Loading] Component indikator saat data cuaca/wilayah sedang dimuat
function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-teal-400">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="text-sm font-medium tracking-wide">Memuat data...</p>
    </div>
  )
}

export default LoadingUI
