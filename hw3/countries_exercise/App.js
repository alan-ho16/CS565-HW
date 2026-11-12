const path = require('path');
const express = require('express');
const {
  MIN_POPULOUS,
  getAlphabetical,
  getPopulous,
  getRegions,
} = require('./lib/countries');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.formatNumber = (value) => value.toLocaleString('en-US');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/home'));

app.get('/home', (req, res) => {
  res.render('home', { title: 'Home', active: '/home' });
});

// All countries A-Z with capitals and leaders (with titles).
app.get('/countries', async (req, res) => {
  const countries = await getAlphabetical();
  res.render('countries', {
    title: 'Countries',
    active: '/countries',
    countries,
  });
});

// Countries with at least 50 million people, most populous first
app.get('/populous', async (req, res) => {
  const countries = await getPopulous();
  res.render('populous', {
    title: 'Most populous',
    active: '/populous',
    countries,
    threshold: MIN_POPULOUS,
  });
});

// Country count and names for every region
app.get('/regions', async (req, res) => {
  const regions = await getRegions();
  const total = regions.reduce((sum, region) => sum + region.count, 0);
  res.render('regions', {
    title: 'Regions',
    active: '/regions',
    regions,
    total,
  });
});

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Not found',
    heading: 'Page not found',
    message: `There is no page at ${req.path}.`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(502).render('error', {
    title: 'Something went wrong',
    heading: 'We could not load the country data',
    message:
      'The REST Countries service did not respond. Please try again in a moment.',
  });
});

app.listen(PORT, () => {
  console.log(`Countries app running at http://localhost:${PORT}`);
  // Warm the caches so the first page view is fast
  getAlphabetical().catch(() => {});
});
