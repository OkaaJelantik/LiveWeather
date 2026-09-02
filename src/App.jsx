import { useEffect, useState } from 'react'
import { CloudSun, Search } from 'lucide-react'
import RegionSelector from './components/RegionSelector'
import WeatherCard from './components/WeatherCard'
import LoadingUI from './components/LoadingUI'
import ErrorMsg from './components/ErrorMsg'

// === HELPER: normalise respons wilayah.id ke format { id, name } ===
// wilayah.id mengembalikan { data: [{ code, name }] }
const normalise = (json) =>
  (json.data || json).map((item) => ({ id: item.code ?? item.id, name: item.name }))

function App() {
  // === STATE UTAMA ===
  const [provinsiList, setProvinsiList] = useState([])
  const [kotaList, setKotaList] = useState([])
  const [kecamatanList, setKecamatanList] = useState([])

  const [selectedProvinsi, setSelectedProvinsi] = useState(null)
  const [selectedKota, setSelectedKota] = useState(null)
  const [selectedKecamatan, setSelectedKecamatan] = useState(null)

  const [data, setData] = useState(null)           // [State Loading] data cuaca hasil fetch
  const [loading, setLoading] = useState(false)    // [State Loading] indikator sedang memuat
  const [error, setError] = useState(null)         // [Error Handling] pesan error jika gagal

  // === useEffect #1: Fetch daftar Provinsi saat mount ===
  // [useEffect] Dipanggil sekali saat komponen pertama kali di-mount
  useEffect(() => {
    const fetchProvinsi = async () => {
      setLoading(true)    // [State Loading] aktifkan indikator loading
      setError(null)      // reset error sebelumnya
      try {               // [Try/Catch/Finally] mulai blok pengambilan data
        // Panggil lewat Vite proxy /api/wilayah → https://wilayah.id/api
        const res = await fetch('/api/wilayah/provinces.json')
        if (!res.ok) throw new Error(`Gagal memuat daftar provinsi (${res.status})`) // [Error Handling] cek HTTP error
        const json = await res.json()
        setProvinsiList(normalise(json))
      } catch (err) {     // [Try/Catch/Finally] tangkap error jaringan / HTTP
        setError(err.message)
      } finally {         // [Try/Catch/Finally] selalu matikan loading di sini
        setLoading(false) // [State Loading] matikan indikator loading
      }
    }
    fetchProvinsi()
  }, []) // [useEffect] dependency array kosong = hanya saat mount

  // === useEffect #2: Fetch Kota saat Provinsi berubah ===
  // [useEffect] Bergantung pada selectedProvinsi
  useEffect(() => {
    if (!selectedProvinsi) {
      setKotaList([])
      setSelectedKota(null)
      setKecamatanList([])
      setSelectedKecamatan(null)
      setData(null)
      return
    }
    const fetchKota = async () => {
      setLoading(true)    // [State Loading] aktifkan indikator loading
      setError(null)
      setKotaList([])
      setSelectedKota(null)
      setKecamatanList([])
      setSelectedKecamatan(null)
      setData(null)
      try {               // [Try/Catch/Finally] mulai blok pengambilan data kota
        const res = await fetch(`/api/wilayah/regencies/${selectedProvinsi.id}.json`)
        if (!res.ok) throw new Error(`Gagal memuat daftar kota (${res.status})`) // [Error Handling]
        const json = await res.json()
        setKotaList(normalise(json))
      } catch (err) {     // [Try/Catch/Finally] tangkap error
        setError(err.message)
      } finally {         // [Try/Catch/Finally]
        setLoading(false) // [State Loading]
      }
    }
    fetchKota()
  }, [selectedProvinsi]) // [useEffect] reaktif terhadap perubahan provinsi

  // === useEffect #3: Fetch Kecamatan saat Kota berubah ===
  // [useEffect] Bergantung pada selectedKota
  useEffect(() => {
    if (!selectedKota) {
      setKecamatanList([])
      setSelectedKecamatan(null)
      setData(null)
      return
    }
    const fetchKecamatan = async () => {
      setLoading(true)    // [State Loading]
      setError(null)
      setKecamatanList([])
      setSelectedKecamatan(null)
      setData(null)
      try {               // [Try/Catch/Finally]
        const res = await fetch(`/api/wilayah/districts/${selectedKota.id}.json`)
        if (!res.ok) throw new Error(`Gagal memuat daftar kecamatan (${res.status})`) // [Error Handling]
        const json = await res.json()
        setKecamatanList(normalise(json))
      } catch (err) {     // [Try/Catch/Finally]
        setError(err.message)
      } finally {         // [Try/Catch/Finally]
        setLoading(false) // [State Loading]
      }
    }
    fetchKecamatan()
  }, [selectedKota]) // [useEffect] reaktif terhadap perubahan kota

  // === useEffect #4: Fetch koordinat lalu data cuaca saat Kecamatan berubah ===
  // [useEffect] Bergantung pada selectedKecamatan
  useEffect(() => {
    if (!selectedKecamatan) {
      setData(null)
      return
    }
    const fetchWeather = async () => {
      setLoading(true)    // [State Loading]
      setError(null)
      setData(null)
      try {               // [Try/Catch/Finally] mulai proses dua-tahap: geocode → cuaca
        // Langkah 1: Ambil koordinat lat/lon dari Nominatim lewat Vite proxy
        const q = encodeURIComponent(`${selectedKecamatan.name}, ${selectedKota?.name}, Indonesia`)
        const geoRes = await fetch(`/api/nominatim/search?format=json&limit=1&q=${q}`)
        if (!geoRes.ok) throw new Error(`Gagal memuat koordinat (${geoRes.status})`) // [Error Handling]
        const geoData = await geoRes.json()
        if (!geoData || geoData.length === 0) {
          throw new Error('Koordinat wilayah tidak ditemukan. Coba kecamatan lain.')  // [Error Handling]
        }
        const { lat, lon } = geoData[0]

        // Langkah 2: Ambil data cuaca dari Open-Meteo (tidak butuh proxy, sudah CORS-friendly)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        )
        if (!weatherRes.ok) throw new Error(`Gagal memuat data cuaca (${weatherRes.status})`) // [Error Handling]
        const weatherData = await weatherRes.json()
        setData(weatherData) // simpan data cuaca ke state
      } catch (err) {     // [Try/Catch/Finally] tangkap error geocode atau cuaca
        setError(err.message)
      } finally {         // [Try/Catch/Finally] selalu matikan loading
        setLoading(false) // [State Loading]
      }
    }
    fetchWeather()
  }, [selectedKecamatan, selectedKota]) // [useEffect] reaktif terhadap perubahan kecamatan

  // Label lokasi lengkap untuk ditampilkan di WeatherCard
  const locationLabel = [selectedKecamatan?.name, selectedKota?.name, selectedProvinsi?.name]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* === HEADER === */}
      <header className="border-b border-slate-700 px-6 py-4 flex items-center gap-3">
        <CloudSun className="w-7 h-7 text-teal-400" />
        <h1 className="text-xl font-bold tracking-tight">
          Live<span className="text-teal-400">Weather</span> Indonesia
        </h1>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-slate-400 text-sm">
            Pilih wilayah secara berjenjang untuk melihat cuaca real-time.
          </p>
        </div>

        {/* Panel Seleksi Wilayah */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <RegionSelector
            provinsiList={provinsiList}
            kotaList={kotaList}
            kecamatanList={kecamatanList}
            selectedProvinsi={selectedProvinsi}
            selectedKota={selectedKota}
            selectedKecamatan={selectedKecamatan}
            onProvinsiChange={setSelectedProvinsi}
            onKotaChange={setSelectedKota}
            onKecamatanChange={setSelectedKecamatan}
          />

          {/* Hint pencarian */}
          {selectedKecamatan && !loading && !data && !error && (
            <div className="flex items-center gap-2 mt-4 text-slate-400 text-xs">
              <Search className="w-3.5 h-3.5" />
              <span>Mencari data cuaca untuk <span className="text-teal-400">{selectedKecamatan.name}</span>…</span>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {loading && <LoadingUI />}

        {/* Error alert */}
        {error && !loading && <ErrorMsg message={error} />}

        {/* Weather card */}
        {data && !loading && !error && (
          <WeatherCard data={data} location={locationLabel} />
        )}
      </main>

      {/* === FOOTER === */}
      <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800">
        Data cuaca: <span className="text-slate-500">Open-Meteo</span> · Wilayah: <span className="text-slate-500">wilayah.id</span> · Geocode: <span className="text-slate-500">OpenStreetMap Nominatim</span>
      </footer>
    </div>
  )
}

export default App
