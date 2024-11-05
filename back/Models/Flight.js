
const mongoose = require('mongoose');

// Define the schema for flight seat categories
const seatCategorySchema = new mongoose.Schema({
  name: String,
  price: Number,
  rows: [Number],
});

// Define the schema for flight layout
const layoutSchema = new mongoose.Schema({
  rows: Number,
  seatsPerRow: Number,
  seatConfiguration: [[String]],
});

// Define the main flight schema
const flightSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [String],
  flightName: { type: String, required: true },
  baseFare: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  noOfSeatsAvailable: { type: Number, required: true },
  layout: layoutSchema,
  seatCategories: [seatCategorySchema],
  bookedSeats: { type: [String], default: [] }, // New field to track booked seats
});


// Create and export the Flight model
module.exports = mongoose.model('Flight', flightSchema, 'flight');
