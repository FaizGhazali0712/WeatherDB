import { useState } from "react";
import axios from "./api/axios";

function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("lastWeather");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn("Failed to parse saved weather", e);
      return {};
    }
  });
  const [location, setLocation] = useState(() => {
    try {
      return localStorage.getItem("lastSearch") || "";
    } catch  {
      return "";
    }
  });

  const [savedWeathers, setSavedWeathers] = useState(() => {
    try {
      const raw = localStorage.getItem("savedWeathers");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  const fetchWeather = async (city) => {
    if (!city) return;
    const q = `/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    try {
      const response = await axios.get(q);
      setData(response.data);
      // persist last response and search term
      try {
        localStorage.setItem("lastWeather", JSON.stringify(response.data));
        localStorage.setItem("lastSearch", city);
        // push to stacked savedWeathers (most recent first), dedupe by name+country, limit 8
        setSavedWeathers((prev) => {
          const key = (r) => `${r.name.toLowerCase()}|${r.sys?.country || ''}`;
          const next = [response.data, ...prev.filter((r) => key(r) !== key(response.data))].slice(0, 8);
          try {
            localStorage.setItem("savedWeathers", JSON.stringify(next));
          } catch (e) {
            console.warn("Could not persist savedWeathers", e);
          }
          return next;
        });
      } catch (e) {
        console.warn("Could not persist lastWeather/lastSearch", e);
      }

      // update history (most recent first), dedupe, limit to 8
      
    } catch  {
      alert("Kota tidak ditemukan!");
    }
  };

  const removeSaved = (item) => {
    setSavedWeathers((prev) => {
      const key = (r) => `${r.name.toLowerCase()}|${r.sys?.country || ''}|${r.dt || 0}`;
      const next = prev.filter((r) => key(r) !== key(item));
      try {
        localStorage.setItem("savedWeathers", JSON.stringify(next));
      } catch (e) {
        console.warn("Could not persist savedWeathers", e);
      }
      return next;
    });
  };

  const clearAllSaved = () => {
    setSavedWeathers([]);
    try {
      localStorage.removeItem("savedWeathers");
    } catch (e) {
      console.warn("Could not clear savedWeathers", e);
    }
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeather(location);
      setLocation("");
    }
  };

  // helpers: format local time using location timezone offset (seconds)
  const formatLocalTime = (unixUtcSeconds, timezoneOffsetSeconds) => {
    if (!unixUtcSeconds && unixUtcSeconds !== 0) return null;
    const t = (unixUtcSeconds + (timezoneOffsetSeconds || 0)) * 1000;
    const d = new Date(t);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const timezone = data.timezone ?? 0;
  const sunrise = data.sys?.sunrise ? formatLocalTime(data.sys.sunrise, timezone) : null;
  const sunset = data.sys?.sunset ? formatLocalTime(data.sys.sunset, timezone) : null;

  const countryFlag = (code) => {
    if (!code) return null;
    try {
      return code
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
    } catch  {
      return null;
    }
  };

  const mainIcon = data.weather?.[0]?.icon;
  const iconUrl = (ic) => (ic ? `https://openweathermap.org/img/wn/${ic}@2x.png` : null);

  return (
    <>
     <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-start gap-6 pt-20 px-4">
      {/* Left column: Search + Weather */}
      <div className="flex-1 max-w-3xl w-full">
        {/* Search Section */}
        <div className="text-center p-4">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Masukkan Nama Kota (Contoh: Jakarta)..."
          className="p-4 w-80 rounded-2xl bg-white/10 border border-white/20 outline-none focus:border-blue-400 transition-all"
        />
        {/* Search history (moved to right-side panel) */}
        </div>
      </div>

      {/* Weather Display Section */}
      {data.name && (
        <div className="relative mt-6 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl text-left overflow-hidden">
          {/* large vertical temp (decorative) */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-90 origin-left text-white/40 select-none pointer-events-none">
            <span className="text-[7rem] font-extrabold leading-none">{data.main?.temp ? Math.round(data.main.temp) : '--'}</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="pl-28 w-full">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-semibold tracking-widest">
                  {data.name}
                  {data.sys?.country && (
                    <span className="text-sm ml-3 text-gray-300">{countryFlag(data.sys.country)} {data.sys.country}</span>
                  )}
                </h1>
                <div className="text-right">
                  <div className="text-sm text-gray-300 uppercase">{data.weather ? data.weather[0].main : ''}</div>
                  {mainIcon && (
                    <img src={iconUrl(mainIcon)} alt={data.weather?.[0]?.description || ''} className="w-16 h-16 inline-block mt-2" />
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-6xl font-bold">{data.main?.temp ? Math.round(data.main.temp) : '--'}</h2>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <p className="text-gray-400">Sunrise</p>
                  <p className="font-bold">{sunrise ?? '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Sunset</p>
                  <p className="font-bold">{sunset ?? '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Humidity</p>
                  <p className="font-bold">{data.main?.humidity ?? '-'}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Wind</p>
                  <p className="font-bold">{data.wind?.speed ?? '-'} MPH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      
      <aside className="w-full md:w-80 sticky top-24 self-start">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-3">Pencarian Tersimpan</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-300">{savedWeathers.length ? `${savedWeathers.length} tersimpan` : 'Belum ada pencarian tersimpan.'}</div>
              {savedWeathers.length > 0 && (
                <div className="flex items-center gap-2">
                  <button onClick={clearAllSaved} className="text-xs px-2 py-1 bg-red-600/20 hover:bg-red-600/30 rounded">Hapus semua</button>
                </div>
              )}
            </div>
            {savedWeathers.map((s) => (
              <div key={`${s.name}-${s.sys?.country}-${s.dt}`} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/3 hover:bg-white/6 border border-white/5">
                <button
                  onClick={() => {
                    setData(s);
                    setLocation(s.name);
                  }}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  {s.weather?.[0]?.icon && (
                    <img src={iconUrl(s.weather[0].icon)} alt={s.weather[0].description || ''} className="w-10 h-10" />
                  )}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span className="text-xl">{countryFlag(s.sys?.country)}</span>
                      <span>{s.name}</span>
                      {s.sys?.country && <span className="text-sm text-gray-300">({s.sys.country})</span>}
                    </div>
                    <div className="text-sm text-gray-400">{s.main?.temp ? Math.round(s.main.temp) : ''}</div>
                  </div>
                </button>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => removeSaved(s)} className="text-sm px-2 py-1 bg-white/10 hover:bg-white/20 rounded">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

    </>
    
  );
}

export default App;