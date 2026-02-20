import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
});

// attach default params (will include API key if provided via Vite env)
const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
if (!OPENWEATHER_KEY) console.warn('VITE_OPENWEATHER_KEY not set. Set it in .env to fetch live weather.');

instance.defaults.params = {
  appid: OPENWEATHER_KEY,
  units: 'metric'
};

export default instance;
