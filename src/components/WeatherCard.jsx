import React from 'react';

export default function WeatherCard({ data }) {
  const temp = data?.main?.temp;
  const icon = data?.weather?.[0]?.icon;
  const description = data?.weather?.[0]?.main;

  return (
    <div className="mt-10 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl text-center max-w-md w-full">
      <h1 className="text-3xl font-light tracking-widest">{data.name}</h1>

      <div className="mt-6 flex items-center justify-center gap-4">
        {icon && (
          <img
            src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-20 h-20"
          />
        )}
        <h2 className="text-6xl font-bold">{temp ? Math.round(temp) : '--'}°C</h2>
      </div>

      <p className="mt-2 text-blue-300 font-medium uppercase tracking-widest">{description || ''}</p>

      <div className="flex justify-between gap-10 mt-6 p-4 border-t border-white/10">
        <div>
          <p className="text-gray-400 text-sm">Kelembapan</p>
          <p className="font-bold">{data.main?.humidity ?? '--'}%</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Angin</p>
          <p className="font-bold">{data.wind?.speed ?? '--'} MPH</p>
        </div>
      </div>
    </div>
  );
}
