// // models/bus.js

// const mongoose = require('mongoose');

// const busSchema = new mongoose.Schema({
//     source: {
//         type: String,
//         required: true, // Ensure this field is required
//     },
//     destination: {
//         type: String,
//         required: true, // Ensure this field is required
//     },
//     stops: {
//         type: [String], // Array of strings for stops
//         default: [], // Default to an empty array
//     },
//     busName: {
//         type: String,
//         required: true, // Ensure this field is required
//     },
//     baseFare: {
//         type: Number,
//         required: true, // Ensure this field is required
//     },
//     startTime: {
//         type: String,
//         required: true, // Ensure this field is required
//     },
//     endTime: {
//         type: String,
//         required: true, // Ensure this field is required
//     },
//     noOfSeatsAvailable: {
//         type: Number,
//         required: true, // Ensure this field is required
//     },
//     layout: {
//         rows: {
//             type: Number,
//             required: true, // Ensure this field is required
//         },
//         seatsPerRow: {
//             type: Number,
//             required: true, // Ensure this field is required
//         },
//         seatConfiguration: {
//             type: [[String]], // 2D array of strings for seat configuration
//             required: true, // Ensure this field is required
//         },
//     },
// });

// // Ensure it uses the 'buses' collection
// module.exports = mongoose.model('Bus', busSchema, 'bus');

const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true, // Ensure this field is required
  },
  destination: {
    type: String,
    required: true, // Ensure this field is required
  },
  stops: {
    type: [String], // Array of strings for stops
    default: [], // Default to an empty array
  },
  busName: {
    type: String,
    required: true, // Ensure this field is required
  },
  baseFare: {
    type: Number,
    required: true, // Ensure this field is required
  },
  startTime: {
    type: String,
    required: true, // Ensure this field is required
  },
  endTime: {
    type: String,
    required: true, // Ensure this field is required
  },
  noOfSeatsAvailable: {
    type: Number,
    required: true, // Ensure this field is required
  },
  bookedSeats: {
    type: [String], // Array to store booked seat numbers
    default: [], // Default to an empty array
  },
  layout: {
    rows: {
      type: Number,
      required: true, // Ensure this field is required
    },
    seatsPerRow: {
      type: Number,
      required: true, // Ensure this field is required
    },
    seatConfiguration: {
      type: [[String]], // 2D array of strings for seat configuration
      required: true, // Ensure this field is required
    },
  },
});

// Ensure it uses the 'buses' collection
module.exports = mongoose.model("Bus", busSchema, "bus"); // Use 'bus' as the collection name
