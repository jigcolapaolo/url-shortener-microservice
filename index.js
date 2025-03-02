require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let savedUrls = []

app.get('/api/shorturl/:shorturl' ,(req, res) => {
  const { shorturl } = req.params

  const urlObject = savedUrls.find(u => u.short_url === parseInt(shorturl))

  if (urlObject) res.redirect(urlObject.original_url)
  else  res.json({ error: "NOT FOUND" })
})

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body

  let host
  try {
    host = new URL(url).hostname
  } catch (err) {
    return res.json({ error: "invalid url" })
  }

  dns.lookup(host, (err, address, family) => {
    if (err) return res.json({ error: 'invalid url' })

    const shortUrl = Math.floor(Math.random() * 100)
      
    const urlObject = {
      "original_url": url,
      "short_url": shortUrl
    }

    savedUrls.push(urlObject)

    res.json(urlObject)
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
