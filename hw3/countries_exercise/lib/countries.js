require('dotenv').config();

const MIN_POPULOUS = 50000000;
const API_BASE = 'https://api.restcountries.com/countries/v5';
const PAGE_SIZE = 100; // max allowed on the free plan
const FIELDS = [
  'names.common',
  'capitals',
  'codes.alpha_2',
  'codes.alpha_3',
  'population',
  'flag.url_svg',
  'flag.url_png',
  'region',
  'leaders',
].join(',');

// Leaders are paywalled, and on the free plan the API returns an
// upgrade notice -- so I hardcoded some leaders.
const leaders = {
  USA: { name: 'Donald Trump', title: 'President' },
  FRA: { name: 'Emmanuel Macron', title: 'President' },
  GBR: { name: 'Keir Starmer', title: 'Prime Minister' },
  DEU: { name: 'Friedrich Merz', title: 'Chancellor' },
  CAN: { name: 'Mark Carney', title: 'Prime Minister' },
  JPN: { name: 'Sanae Takaichi', title: 'Prime Minister' },
  IND: { name: 'Narendra Modi', title: 'Prime Minister' },
  CHN: { name: 'Xi Jinping', title: 'President' },
  RUS: { name: 'Vladimir Putin', title: 'President' },
  BRA: { name: 'Luiz Inácio Lula da Silva', title: 'President' },
  MEX: { name: 'Claudia Sheinbaum', title: 'President' },
  IDN: { name: 'Prabowo Subianto', title: 'President' },
};

async function fetchPage(offset) {
  const apiKey = process.env.RESTCOUNTRIES_API_KEY;
  if (!apiKey) {
    throw new Error(
      'RESTCOUNTRIES_API_KEY is not set. Add it to your .env file.',
    );
  }

  const url = `${API_BASE}?limit=${PAGE_SIZE}&offset=${offset}&response_fields=${FIELDS}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(body?.data?.objects)) {
    const message = body?.errors?.[0]?.message || `HTTP ${response.status}`;
    throw new Error(`REST Countries error: ${message}`);
  }
  return body.data;
}

async function loadAll() {
  const first = await fetchPage(0);
  const total = first.meta?.total ?? first.objects.length;

  const offsets = [];
  for (let offset = first.objects.length; offset < total; offset += PAGE_SIZE) {
    offsets.push(offset);
  }

  const rest = await Promise.all(offsets.map((offset) => fetchPage(offset)));
  return [first, ...rest].flatMap((page) => page.objects);
}

// Cache so the three routes share one download (3 requests total per hour).
let cache = null;
let cachedAt = 0;
let inFlight = null;
const CACHE_MS = 60 * 60 * 1000;

async function fetchCountries() {
  if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
  if (inFlight) return inFlight;

  inFlight = loadAll()
    .then((data) => {
      cache = data;
      cachedAt = Date.now();
      return data;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

// Helpers for incomplete data

const nameOf = (c) => c.names?.common || 'Unknown';

const capitalOf = (c) => {
  if (!Array.isArray(c.capitals)) return 'N/A';
  const names = c.capitals.map((cap) => cap?.name).filter(Boolean);
  return names.length ? names.join(' / ') : 'N/A';
};

const leaderOf = (c) => {
  // Use the API's data if the plan includes it (free plan returns a notice object).
  const fromApi = Array.isArray(c.leaders)
    ? c.leaders
        .filter((l) => l?.name && l?.title)
        .map((l) => `${l.title} ${l.name}`)
    : [];
  if (fromApi.length) return fromApi.join(', ');

  const fallback = leaders[c.codes?.alpha_3];
  return fallback ? `${fallback.title} ${fallback.name}` : 'N/A';
};

const flagOf = (c) => {
  if (c.flag?.url_svg) return c.flag.url_svg;
  if (c.flag?.url_png) return c.flag.url_png;
  const code = c.codes?.alpha_2;
  return code
    ? `https://flags.restcountries.com/v5/w320/${code.toLowerCase()}.png`
    : '';
};

// ---- ROUTE DATA ----

// 1. All countries A-Z with capitals and leaders
async function getAlphabetical() {
  const countries = await fetchCountries();
  return countries
    .map((c) => ({
      name: nameOf(c),
      capital: capitalOf(c),
      leader: leaderOf(c),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// 2. Population >= 50M, most populous first, with flags
async function getPopulous() {
  const countries = await fetchCountries();
  return countries
    .filter((c) => (c.population || 0) >= MIN_POPULOUS)
    .map((c) => ({
      name: nameOf(c),
      population: c.population,
      flag: flagOf(c),
    }))
    .sort((a, b) => b.population - a.population);
}

// 3. Country count and names for every region
async function getRegions() {
  const countries = await fetchCountries();
  const regionMap = {};

  countries.forEach((c) => {
    const region = c.region || 'Unspecified';
    (regionMap[region] ||= []).push(nameOf(c));
  });

  return Object.keys(regionMap)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      count: regionMap[name].length,
      countries: regionMap[name].sort((a, b) => a.localeCompare(b)),
    }));
}

module.exports = {
  MIN_POPULOUS,
  getAlphabetical,
  getPopulous,
  getRegions,
};
