import { AlertTriangle } from 'lucide-react'

// [Error Handling] Component untuk menampilkan pesan error jaringan atau data tidak ditemukan
function ErrorMsg({ message }) {
  return (
    <div className="flex items-center gap-3 bg-red-900/40 border border-red-500 text-red-300 rounded-xl p-4 mt-4">
      <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export default ErrorMsg
