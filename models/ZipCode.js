const mongoose = require('mongoose');

const zipCodeSchema = new mongoose.Schema({
  zipcode: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
});

module.exports = mongoose.model('ZipCode', zipCodeSchema);
