import { useState } from "react";
import axios from "./api/axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;
  const url = `/weather?q=${location}&units=metric&appid=${API_KEY}`;

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await axios.get(url);
        setData(response.data); // Menyimpan objek JSON cuaca
        console.log(response.data); // Cek JSON di console
      } catch  {
        alert("Kota tidak ditemukan!");
      }
      setLocation(""); // Reset input setelah enter
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-20">
      {/* Search Section */}
      <div className="text-center p-4">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Masukkan Nama Kota (Contoh: Jakarta)..."
          className="p-4 w-80 rounded-2xl bg-white/10 border border-white/20 outline-none focus:border-blue-400 transition-all"
        />
      </div>

      {/* Weather Display Section */}
      {data.name && (
        <div className="mt-10 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl text-center">
          <h1 className="text-3xl font-light tracking-widest">{data.name}</h1>
          <div className="mt-6">
            <h2 className="text-8xl font-bold">{data.main?.temp.toFixed()}°C</h2>
          </div>
          <div className="mt-4">
            <p className="text-xl text-blue-300 font-medium uppercase tracking-widest">
              {data.weather ? data.weather[0].main : null}
            </p>
          </div>
          
          {/* Detail Info */}
          <div className="flex justify-between gap-10 mt-10 p-4 border-t border-white/10">
            <div>
              <p className="text-gray-400 text-sm">Kelembapan</p>
              <p className="font-bold">{data.main?.humidity}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Angin</p>
              <p className="font-bold">{data.wind?.speed} MPH</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
