import React, { useEffect, useState, useCallback } from 'react';
import axios from './api/axios';
import WeatherCard from './components/WeatherCard';

function useLocalDB(key, initial = []) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch  {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch  {
      // ignore write errors (e.g. quota exceeded)
    }
  }, [key, state]);

  return [state, setState];
}

export default function App() {
  const [query, setQuery] = useState('Jakarta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [db, setDb] = useLocalDB('weatherdb.v1', []);
  const [current, setCurrent] = useState(null);

  const handleSaveCurrent = useCallback(() => {
    if (!current) return;
    setDb((prev) => {
      const exists = prev.find((r) => r.id === current.id);
      if (exists) return prev.map((r) => (r.id === current.id ? current : r));
      return [current, ...prev].slice(0, 50);
    });
  }, [current, setDb]);

  const fetchCity = useCallback(async (q, { background = false } = {}) => {
    if (!q) return;
    if (!background) {
      setLoading(true);
      setError(null);
    }
    try {
      const { data } = await axios.get('/weather', { params: { q } });
      setCurrent(data);
      setDb((prev) => {
        const exists = prev.find((r) => r.id === data.id);
        if (exists) return prev.map((r) => (r.id === data.id ? data : r));
        return [data, ...prev].slice(0, 50);
      });
    } catch (e) {
      if (!background) setError(e?.response?.data?.message || e.message || 'Failed');
    } finally {
      if (!background) setLoading(false);
    }
  }, [setDb]);

  // realtime polling every 60s when a city is selected
  useEffect(() => {
    let t;
    if (current?.name) {
      t = setInterval(() => fetchCity(current.name), 60000);
    }
    return () => clearInterval(t);
  }, [current, fetchCity]);

  // init: load last stored or default
  useEffect(() => {
    if (db.length > 0) setCurrent(db[0]);
  }, [db], );

  const handleSubmit = (e) => {
    e?.preventDefault();
    fetchCity(query);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-slate-900 to-black text-white flex items-start justify-center p-6">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">WeatherDB — Realtime</h1>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama kota..."
              className="px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:outline-none"
            />
            <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500">Cari</button>
          </form>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            {loading && <div className="mb-4">Memuat...</div>}
            {error && <div className="mb-4 text-red-400">{error}</div>}

            {current ? (
              <WeatherCard data={current} onSave={handleSaveCurrent} />
            ) : (
              <div className="p-6 bg-white/3 rounded-lg">Tidak ada data. Cari kota untuk memulai.</div>
            )}
          </section>

          <aside className="space-y-4 z-10">
            <div className="p-4 bg-white/3 rounded-lg">
              <h2 className="font-semibold mb-2">Riwayat</h2>
              {db.length === 0 && <div className="text-sm text-gray-300">Kosong</div>}
              <ul className="space-y-2 max-h-96 overflow-auto">
                {db.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        const city = (item.name || '').trim();
                        if (!city) return;
                        // immediately show cached data, then refresh in background
                        setQuery(city);
                        setCurrent(item);
                        // fetch fresh data but don't block UI
                        fetchCity(city);
                      }}
                      className={`w-full text-left p-2 rounded hover:bg-white/5 cursor-pointer ${current?.id === item.id ? 'bg-white/6 border-l-4 border-blue-400' : ''}`}
                      aria-current={current?.id === item.id ? 'true' : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.sys?.country && (
                            <img src={`https://flagcdn.com/w20/${item.sys.country.toLowerCase()}.png`} alt={item.sys.country} className="w-5 h-3 rounded-sm object-cover" />
                          )}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-300">{item.weather?.[0]?.main} • {Math.round(item.main?.temp)}</div>
                          </div>
                        </div>
                        <img src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon}@2x.png`} alt="icon" className="w-12 h-12 pointer-events-none" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white/3 rounded-lg text-sm">
              <div className="mb-2">Pengaturan</div>
              <div className="text-gray-300">Polling otomatis aktif ketika sebuah kota dipilih (60s).</div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
