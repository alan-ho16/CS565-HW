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
  'currencies',
].join(',');

const fetchPage = async (offset) => {
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
};

const loadAll = async () => {
  const first = await fetchPage(0);
  const total = first.meta?.total ?? first.objects.length;

  const offsets = [];
  for (let offset = first.objects.length; offset < total; offset += PAGE_SIZE) {
    offsets.push(offset);
  }

  const rest = await Promise.all(offsets.map((offset) => fetchPage(offset)));
  return [first, ...rest].flatMap((page) => page.objects);
};

// Cache so the three routes share one download (3 requests total per hour).
let cache = null;
let cachedAt = 0;
let inFlight = null;
const CACHE_MS = 60 * 60 * 1000;

const fetchCountries = async () => {
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
};

// Helpers for incomplete data

const nameOf = (c) => c.names?.common || 'Unknown';

const capitalOf = (c) => {
  if (!Array.isArray(c.capitals)) return 'N/A';
  const names = c.capitals.map((cap) => cap?.name).filter(Boolean);
  return names.length ? names.join(' / ') : 'N/A';
};

const currenciesOf = (c) => {
  if (!Array.isArray(c.currencies) || !c.currencies.length) return 'N/A';
  const formatted = c.currencies
    .filter((curr) => curr?.name)
    .map((curr) => (curr.symbol ? `${curr.name} (${curr.symbol})` : curr.name));

  return formatted.length ? formatted.join(', ') : 'N/A';
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

// 1. All countries A-Z with capitals and currencies
const getAlphabetical = async () => {
  const countries = await fetchCountries();
  return countries
    .map((c) => ({
      name: nameOf(c),
      capital: capitalOf(c),
      currencies: currenciesOf(c),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// 2. Population >= 50M, most populous first, with flags
const getPopulous = async () => {
  const countries = await fetchCountries();
  return countries
    .filter((c) => (c.population || 0) >= MIN_POPULOUS)
    .map((c) => ({
      name: nameOf(c),
      population: c.population,
      flag: flagOf(c),
    }))
    .sort((a, b) => b.population - a.population);
};

// 3. Country count and names for every region
const getRegions = async () => {
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
};

module.exports = {
  MIN_POPULOUS,
  getAlphabetical,
  getPopulous,
  getRegions,
};
