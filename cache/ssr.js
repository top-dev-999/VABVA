// const puppeteer = require('puppeteer');
// const util = require('util');

// var redis = require("redis"),
//   client = redis.createClient();

// //allows us to use await with redis
// client.get = util.promisify(client.get);

// // In-memory cache of rendered pages. Note: this will be cleared whenever the
// // server process stops. If you need true persistence, use something like
// // Google Cloud Storage (https://firebase.google.com/docs/storage/web/start).
// ignoreList = [
//   '.js',
//   '.css',
//   '.xml',
//   '.less',
//   '.png',
//   '.jpg',
//   '.jpeg',
//   '.gif',
//   '.pdf',
//   '.doc',
//   '.txt',
//   '.ico',
//   '.rss',
//   '.zip',
//   '.mp3',
//   '.rar',
//   '.exe',
//   '.wmv',
//   '.doc',
//   '.avi',
//   '.ppt',
//   '.mpg',
//   '.mpeg',
//   '.tif',
//   '.wav',
//   '.mov',
//   '.psd',
//   '.ai',
//   '.xls',
//   '.mp4',
//   '.m4a',
//   '.swf',
//   '.dat',
//   '.dmg',
//   '.iso',
//   '.flv',
//   '.m4v',
//   '.torrent',
//   '.woff',
//   '.ttf',
//   '.svg',
//   '.webmanifest',
//   '/getlocation',
//   '/getprice'
// ];

// const RENDER_CACHE = new Map();
// async function ssr(url) {
// return;
//   let ignore = false;
//   await ignoreList.map(async (value) => {
//     if (url.toLowerCase().indexOf(value) !== -1) {
//       ignore = true
//     }
//   })

//   if (ignore !== false) {
//     return false;
//   }

//   let _cache = await client.get(url)
//   if (_cache !== null) {
//     console.log("returned cache...")
//     return { html: _cache, ttRenderMs: 0 }
//   }

//   if (RENDER_CACHE.has(url) == true) {
//     return false;
//   }

//   const start = Date.now();
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   try {
//     // 1. Intercept network requests.
//     await page.setRequestInterception(true);
//     page.on('request', req => {
//       // 2. Ignore requests for resources that don't produce DOM
//       // (images, stylesheets, media).
//       const allowlist = ['document', 'script', 'xhr', 'fetch'];
//       if (!allowlist.includes(req.resourceType())) {
//         return req.abort();
//       }

//       // 3. Pass through all other requests.
//       req.continue();
//     });
//     // set user agent (override the default headless User Agent)
//     await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
//     // networkidle0 waits for the network to be idle (no requests for 500ms).
//     // The page's JS has likely produced markup by this point, but wait longer
//     // if your site lazy loads, etc.
//     RENDER_CACHE.set(url, true); // cache rendered page.
//     await page.goto(url, { waitUntil: 'networkidle0' });
//     await page.waitForSelector('.row'); // ensure #posts exists in the DOM.
//   } catch (err) {
//     console.error(err);
//     throw new Error('page.goto/waitForSelector timed out.');
//   }

//   const html = await page.content(); // serialized HTML of page DOM.

//   client.set(url, html, "EX", 7885000); // cache rendered page.

//   await browser.close();
//   running = false;

//   const ttRenderMs = Date.now() - start;
//   console.log(`Headless rendered page: ${url} in: ${ttRenderMs}ms`);

//   //expires every 3 Months, set in seconds...

//   return { html, ttRenderMs };
// }

// module.exports = ssr;
