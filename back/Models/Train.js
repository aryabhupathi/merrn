const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  coachName: { type: String, required: true },
  noOfSeatsAvailable: { type: Number, required: true },
  fare: { type: Number, required: true },
});

const trainSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  stops: [{ type: String }],
  coaches: [coachSchema],
});

module.exports = mongoose.model('Train', trainSchema, 'train');
