import { MapPin } from 'lucide-react'

// RegionSelector menampilkan 3 elemen <select> sebagai Controlled Component
function RegionSelector({
  provinsiList, kotaList, kecamatanList,
  selectedProvinsi, selectedKota, selectedKecamatan,
  onProvinsiChange, onKotaChange, onKecamatanChange,
}) {
  const selectClass =
    'w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 ' +
    'focus:outline-none focus:border-teal-500 transition-colors cursor-pointer ' +
    'disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-teal-400 mb-2">
        <MapPin className="w-5 h-5" />
        <span className="font-semibold tracking-wide">Pilih Wilayah</span>
      </div>

      {/* Select Provinsi */}
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1 block">Provinsi</label>
        <select
          className={selectClass}
          value={selectedProvinsi?.id || ''}
          onChange={(e) => {
            const found = provinsiList.find((p) => p.id === e.target.value)
            onProvinsiChange(found || null)
          }}
        >
          <option value="">-- Pilih Provinsi --</option>
          {provinsiList.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Select Kota/Kabupaten */}
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1 block">Kota / Kabupaten</label>
        <select
          className={selectClass}
          value={selectedKota?.id || ''}
          disabled={kotaList.length === 0}
          onChange={(e) => {
            const found = kotaList.find((k) => k.id === e.target.value)
            onKotaChange(found || null)
          }}
        >
          <option value="">-- Pilih Kota/Kabupaten --</option>
          {kotaList.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
      </div>

      {/* Select Kecamatan */}
      <div>
        <label className="text-slate-400 text-xs font-medium mb-1 block">Kecamatan</label>
        <select
          className={selectClass}
          value={selectedKecamatan?.id || ''}
          disabled={kecamatanList.length === 0}
          onChange={(e) => {
            const found = kecamatanList.find((k) => k.id === e.target.value)
            onKecamatanChange(found || null)
          }}
        >
          <option value="">-- Pilih Kecamatan --</option>
          {kecamatanList.map((k) => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default RegionSelector
