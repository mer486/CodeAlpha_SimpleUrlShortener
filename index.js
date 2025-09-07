const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid'); // library for generating unique IDs
const Url = require('./models/Url');  // our Mongoose model
const cors = require('cors'); 

const app = express();
const PORT = 3000;
app.use(cors()); 
app.use(express.static('public')); // serve frontend files from "public" folder

// Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/urlShortenerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Route 1: Test route
app.get('/', (req, res) => {
  res.send('Hello, URL Shortener with MongoDB!');
});

// Route 2: Shorten a URL
app.post('/shorten', async (req, res) => {
  console.log("👉 Received body:", req.body); // debug log

  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  // Generate short code (6 characters)
  const shortCode = nanoid(6);

  try {
    // Save to MongoDB
    const newUrl = new Url({
      longUrl,     // ✅ consistent naming
      shortCode,
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:${PORT}/${shortCode}`,
      longUrl,
    });
  } catch (err) {
    console.error("🔥 Error saving to DB:", err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Route 3: Redirect to original URL
app.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (url) {
      res.redirect(url.longUrl);   // ✅ match the saved field
    } else {
      res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (err) {
    console.error("🔥 Error redirecting:", err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
