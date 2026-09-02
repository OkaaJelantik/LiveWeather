TECH STACK: React (Vite) + Tailwind CSS (vite) + Lucide React

Platform Live Weather App Indonesia interaktif berbasis pemilihan wilayah berjenjang (Provinsi -> Kota/Kabupaten -> Kecamatan) untuk menampilkan data cuaca real-time.

HARD CONSTRAINTS:
1. Tiga State Wajib Fetching: Kelola state `data` (cuaca), `loading` ( boolean indikator), dan `error` (pesan kegagalan) di Parent (`App.jsx`).
2. Reactive Fetch & useEffect Berjenjang:
   - `useEffect(..., [])`: Fetch daftar Provinsi dari `/api/wilayah/provinces.json` (proxy ke `https://wilayah.id/api/provinces.json`) sekali saat mount.
   - `useEffect(..., [selectedProvinsi])`: Fetch daftar Kota berdasarkan ID provinsi yang dipilih.
   - `useEffect(..., [selectedKota])`: Fetch daftar Kecamatan berdasarkan ID kota yang dipilih.
   - `useEffect(..., [selectedKecamatan])`: 
     a. Fetch koordinat Lat/Long dari OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org/search?format=json&q={namaKecamatan},{namaKota}`).
     b. Setelah dapat koordinat, fetch cuaca dari Open-Meteo (`https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`).
3. Handling HTTP Errors: Gunakan blok `try...catch...finally`. Didalam `try`, periksa `if (!res.ok)` secara manual dan throw Error jika gagal. Pastikan `setLoading(false)` dipanggil di dalam blok `finally`.
4. Modular Components (Simpan di `src/components/`):
   - `App.jsx`: Parent component tempat penyimpanan state utama dan logika fetch API.
   - `RegionSelector.jsx`: Menampilkan 3 elemen `<select>` (Provinsi, Kota, Kecamatan) sebagai Controlled Component.
   - `WeatherCard.jsx`: Menampilkan UI suhu, kecepatan angin, dan kode cuaca jika data berhasil di-fetch.
   - `LoadingUI.jsx`: UI indikator saat data cuaca/wilayah sedang dimuat.
   - `ErrorMsg.jsx`: Component alert jika terjadi error jaringan atau data tidak ditemukan.
5. Code Annotation: Berikan komentar inline singkat pada baris kode kunci dengan tag: `// [useEffect]`, `// [Try/Catch/Finally]`, `// [State Loading]`, dan `// [Error Handling]`.

STYLING & VIBE (Tailwind CSS):
- Tema "Dark Weather Dashboard": Gunakan background `bg-slate-900`, teks `text-white`, card `bg-slate-800` dengan border `border-teal-500`, dan aksen warna `text-teal-400`.
- Tambahkan icon pendukung menggunakan `lucide-react` (seperti Wind, Termometer, MapPin, Search).
