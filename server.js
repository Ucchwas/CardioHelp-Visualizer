const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB (adjust connection string if needed)
mongoose.connect('mongodb://localhost:27017/zipcodeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Import the model
const ZipCode = require('./models/ZipCode');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST endpoint: Add or update a ZIP code's patient count
app.post('/api/zipcode', async (req, res) => {
  const { zipcode } = req.body;
  if (!zipcode) {
    return res.status(400).json({ error: 'Zipcode is required.' });
  }
  try {
    const doc = await ZipCode.findOneAndUpdate(
      { zipcode },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Zipcode updated', data: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint: Retrieve all ZIP codes with counts
app.get('/api/zipcodes', async (req, res) => {
  try {
    const data = await ZipCode.find({});
    const result = {};
    data.forEach(doc => {
      result[doc.zipcode] = doc.count;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server binding to all interfaces so it is accessible externally.
// Use 10.131.58.143 on your mobile app and website to access the API.
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://10.131.58.143:${port}`);
});
