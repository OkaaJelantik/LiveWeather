import { Thermometer, Wind, Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Droplets } from 'lucide-react'

// Mapping WMO weather code ke deskripsi dan icon
function getWeatherInfo(code) {
  if (code === 0) return { label: 'Cerah', icon: <Sun className="w-12 h-12 text-yellow-400" /> }
  if (code <= 3) return { label: 'Berawan Sebagian', icon: <Cloud className="w-12 h-12 text-slate-300" /> }
  if (code <= 49) return { label: 'Berkabut', icon: <Cloud className="w-12 h-12 text-slate-400" /> }
  if (code <= 69) return { label: 'Hujan', icon: <CloudRain className="w-12 h-12 text-blue-400" /> }
  if (code <= 79) return { label: 'Salju', icon: <CloudSnow className="w-12 h-12 text-blue-200" /> }
  if (code <= 99) return { label: 'Badai Petir', icon: <CloudLightning className="w-12 h-12 text-yellow-300" /> }
  return { label: `Kode ${code}`, icon: <Cloud className="w-12 h-12 text-slate-400" /> }
}

// WeatherCard menampilkan data suhu, kecepatan angin, dan kode cuaca
function WeatherCard({ data, location }) {
  const { current_weather } = data
  const { label, icon } = getWeatherInfo(current_weather.weathercode)

  return (
    <div className="mt-6 bg-slate-800 border border-teal-500 rounded-2xl p-6 shadow-lg shadow-teal-900/20">
      {/* Nama lokasi */}
      <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-4">{location}</p>

      {/* Icon & deskripsi cuaca */}
      <div className="flex flex-col items-center gap-2 mb-6">
        {icon}
        <span className="text-white font-semibold text-lg">{label}</span>
      </div>

      {/* Data cuaca dalam grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Suhu */}
        <div className="flex items-center gap-3 bg-slate-700/60 rounded-xl p-4">
          <Thermometer className="w-6 h-6 text-teal-400 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Suhu</p>
            <p className="text-white font-bold text-xl">{current_weather.temperature}°C</p>
          </div>
        </div>

        {/* Kecepatan angin */}
        <div className="flex items-center gap-3 bg-slate-700/60 rounded-xl p-4">
          <Wind className="w-6 h-6 text-teal-400 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Angin</p>
            <p className="text-white font-bold text-xl">{current_weather.windspeed} <span className="text-sm font-normal">km/h</span></p>
          </div>
        </div>

        {/* Kode cuaca WMO */}
        <div className="col-span-2 flex items-center gap-3 bg-slate-700/60 rounded-xl p-4">
          <Droplets className="w-6 h-6 text-teal-400 shrink-0" />
          <div>
            <p className="text-slate-400 text-xs">Kode Cuaca (WMO)</p>
            <p className="text-white font-semibold">{current_weather.weathercode} — {label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
