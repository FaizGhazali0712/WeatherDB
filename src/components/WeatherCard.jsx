import React, { useMemo,  useState } from 'react';

const alpha2ToAlpha3 = {
  AF: 'AFG', AL: 'ALB', DZ: 'DZA', AS: 'ASM', AD: 'AND', AO: 'AGO', AI: 'AIA', AQ: 'ATA', AG: 'ATG', AR: 'ARG',
  AM: 'ARM', AW: 'ABW', AU: 'AUS', AT: 'AUT', AZ: 'AZE', BS: 'BHS', BH: 'BHR', BD: 'BGD', BB: 'BRB', BY: 'BLR',
  BE: 'BEL', BZ: 'BLZ', BJ: 'BEN', BM: 'BMU', BT: 'BTN', BO: 'BOL', BQ: 'BES', BA: 'BIH', BW: 'BWA', BV: 'BVT',
  BR: 'BRA', IO: 'IOT', BN: 'BRN', BG: 'BGR', BF: 'BFA', BI: 'BDI', CV: 'CPV', KH: 'KHM', CM: 'CMR', CA: 'CAN',
  KY: 'CYM', CF: 'CAF', TD: 'TCD', CL: 'CHL', CN: 'CHN', CX: 'CXR', CC: 'CCK', CO: 'COL', KM: 'COM', CG: 'COG',
  CD: 'COD', CK: 'COK', CR: 'CRI', CI: 'CIV', HR: 'HRV', CU: 'CUB', CW: 'CUW', CY: 'CYP', CZ: 'CZE', DK: 'DNK',
  DJ: 'DJI', DM: 'DMA', DO: 'DOM', EC: 'ECU', EG: 'EGY', SV: 'SLV', GQ: 'GNQ', ER: 'ERI', EE: 'EST', SZ: 'SWZ',
  ET: 'ETH', FK: 'FLK', FO: 'FRO', FJ: 'FJI', FI: 'FIN', FR: 'FRA', GF: 'GUF', PF: 'PYF', TF: 'ATF', GA: 'GAB',
  GM: 'GMB', GE: 'GEO', DE: 'DEU', GH: 'GHA', GI: 'GIB', GR: 'GRC', GL: 'GRL', GD: 'GRD', GP: 'GLP', GU: 'GUM',
  GT: 'GTM', GG: 'GGY', GN: 'GIN', GW: 'GNB', GY: 'GUY', HT: 'HTI', HM: 'HMD', VA: 'VAT', HN: 'HND', HK: 'HKG',
  HU: 'HUN', IS: 'ISL', IN: 'IND', ID: 'IDN', IR: 'IRN', IQ: 'IRQ', IE: 'IRL', IM: 'IMN', IL: 'ISR', IT: 'ITA',
  JM: 'JAM', JP: 'JPN', JE: 'JEY', JO: 'JOR', KZ: 'KAZ', KE: 'KEN', KI: 'KIR', KP: 'PRK', KR: 'KOR', KW: 'KWT',
  KG: 'KGZ', LA: 'LAO', LV: 'LVA', LB: 'LBN', LS: 'LSO', LR: 'LBR', LY: 'LBY', LI: 'LIE', LT: 'LTU', LU: 'LUX',
  MO: 'MAC', MG: 'MDG', MW: 'MWI', MY: 'MYS', MV: 'MDV', ML: 'MLI', MT: 'MLT', MH: 'MHL', MQ: 'MTQ', MR: 'MRT',
  MU: 'MUS', YT: 'MYT', MX: 'MEX', FM: 'FSM', MD: 'MDA', MC: 'MCO', MN: 'MNG', ME: 'MNE', MS: 'MSR', MA: 'MAR',
  MZ: 'MOZ', MM: 'MMR', NA: 'NAM', NR: 'NRU', NP: 'NPL', NL: 'NLD', NC: 'NCL', NZ: 'NZL', NI: 'NIC', NE: 'NER',
  NG: 'NGA', NU: 'NIU', NF: 'NFK', MK: 'MKD', MP: 'MNP', NO: 'NOR', OM: 'OMN', PK: 'PAK', PW: 'PLW', PS: 'PSE',
  PA: 'PAN', PG: 'PNG', PY: 'PRY', PE: 'PER', PH: 'PHL', PN: 'PCN', PL: 'POL', PT: 'PRT', PR: 'PRI', QA: 'QAT',
  RE: 'REU', RO: 'ROU', RU: 'RUS', RW: 'RWA', BL: 'BLM', SH: 'SHN', KN: 'KNA', LC: 'LCA', MF: 'MAF', PM: 'SPM',
  VC: 'VCT', WS: 'WSM', SM: 'SMR', ST: 'STP', SA: 'SAU', SN: 'SEN', RS: 'SRB', SC: 'SYC', SL: 'SLE', SG: 'SGP',
  SX: 'SXM', SK: 'SVK', SI: 'SVN', SB: 'SLB', SO: 'SOM', ZA: 'ZAF', GS: 'SGS', SS: 'SSD', ES: 'ESP', LK: 'LKA',
  SD: 'SDN', SR: 'SUR', SJ: 'SJM', SE: 'SWE', CH: 'CHE', SY: 'SYR', TW: 'TWN', TJ: 'TJK', TZ: 'TZA', TH: 'THA',
  TL: 'TLS', TG: 'TGO', TK: 'TKL', TO: 'TON', TT: 'TTO', TN: 'TUN', TR: 'TUR', TM: 'TKM', TC: 'TCA', TV: 'TUV',
  UG: 'UGA', UA: 'UKR', AE: 'ARE', GB: 'GBR', US: 'USA', UM: 'UMI', UY: 'URY', UZ: 'UZB', VU: 'VUT', VE: 'VEN',
  VN: 'VNM', VG: 'VGB', VI: 'VIR', WF: 'WLF', EH: 'ESH', YE: 'YEM', ZM: 'ZMB', ZW: 'ZWE'
};

function toAlpha3(code) {
  if (!code) return null;
  const c = String(code).toUpperCase();
  return alpha2ToAlpha3[c] || null;
}

function countryFlagEmoji(alpha2) {
  if (!alpha2) return null;
  const s = String(alpha2).toUpperCase();
  if (s.length !== 2) return null;
  const A = 0x1f1e6;
  const first = A + (s.charCodeAt(0) - 65);
  const second = A + (s.charCodeAt(1) - 65);
  return String.fromCodePoint(first, second);
}

export default function WeatherCard({ data, }) {
  const temp = data?.main?.temp;
  const icon = data?.weather?.[0]?.icon;
  const description = data?.weather?.[0]?.main;
  const countryAlpha3 = toAlpha3(data?.sys?.country);
  const countryAlpha2 = data?.sys?.country ?? null;
  const countryFlag = countryFlagEmoji(countryAlpha2);
  const countryFlagUrl = countryAlpha2 ? `https://flagcdn.com/w40/${countryAlpha2.toLowerCase()}.png` : null;
  // determine season based on local month & hemisphere (use data.dt + timezone)
  const seasonFromData = (d, currentTime) => {
    if (!d) return null;
    const timezone = d.timezone ?? 0;
    const dt = d.dt ?? currentTime;
    const local = new Date((dt + timezone) * 1000);
    const month = local.getUTCMonth(); // 0..11
    const lat = d.coord?.lat ?? 0;
    const northern = lat >= 0;

    const northernSeason = (m) => {
      if (m === 11 || m === 0 || m === 1) return 'winter';
      if (m >= 2 && m <= 4) return 'spring';
      if (m >= 5 && m <= 7) return 'summer';
      return 'autumn';
    };

    const southernSeason = (m) => {
      if (m === 11 || m === 0 || m === 1) return 'summer';
      if (m >= 2 && m <= 4) return 'autumn';
      if (m >= 5 && m <= 7) return 'winter';
      return 'spring';
    };

    return northern ? northernSeason(month) : southernSeason(month);
  };

  const [currentTime] = useState(() => Math.floor(Date.now() / 1000));

  const season = useMemo(() => seasonFromData(data, currentTime), [data, currentTime]);
  const seasonLogo = {
    spring: '🌱',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️'
  }[season] || null;

  const formatLocalTime = (unixUtcSeconds, timezoneOffsetSeconds) => {
    if (!unixUtcSeconds && unixUtcSeconds !== 0) return '-';
    const t = (unixUtcSeconds + (timezoneOffsetSeconds || 0)) * 1000;
    const d = new Date(t);
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const tz = data?.timezone ?? 0;
  const sunrise = data?.sys?.sunrise ? formatLocalTime(data.sys.sunrise, tz) : '-';
  const sunset = data?.sys?.sunset ? formatLocalTime(data.sys.sunset, tz) : '-';

  // (formatLocalTime, sunrise, sunset and timezone are defined above)

  return (
    <div className="mt-10 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl text-center max-w-md w-full">
      <h1 className="text-3xl font-light tracking-widest">
        {countryFlagUrl ? (
          <img src={countryFlagUrl} alt={countryAlpha2} className="inline-block w-6 h-4 mr-2 align-middle rounded-sm object-cover" />
        ) : (
          <span className="mr-2">{countryFlag ?? ''}</span>
        )}
        {data.name}
      </h1>
      

      <div className="mt-6 flex items-center justify-center gap-4">
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-20 h-20"
          />
        )}
        <h2 className="text-6xl font-bold">{temp ? Math.round(temp) : '--'}</h2>
      </div>

      <p className="mt-2 text-blue-300 font-medium uppercase tracking-widest">{description || ''}</p>

      {seasonLogo && (
        <div className="mt-3">
          <p className="text-gray-400 text-sm">Musim</p>
          <p className="font-bold text-xl">{seasonLogo} {season}</p>
        </div>
      )}

          <div className="grid grid-cols-2 gap-4 mt-6 p-4 border-t border-white/10 text-sm text-gray-300">
            <div>
              <p className="text-gray-400 text-sm">Sunrise</p>
              <p className="font-bold">{sunrise}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sunset</p>
              <p className="font-bold">{sunset}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Kelembapan</p>
              <p className="font-bold">{data.main?.humidity ?? '--'}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Angin</p>
              <p className="font-bold">{data.wind?.speed ?? '--'} MPH</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-sm">Country</p>
              <p className="font-bold">{countryFlag ? `${countryFlag} ${countryAlpha2}` : (countryAlpha3 ?? '--')}</p>
            </div>
          </div>
      {/* sunrise/sunset already shown above in the grid */}
    </div>
  );
}
