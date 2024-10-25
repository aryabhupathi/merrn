const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensure this field is required
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure this field is unique
  },
  password: {
    type: String,
    required: true,
  },
});

// Ensure it uses the 'abc' collection
module.exports = mongoose.model('User', userSchema, 'ticketuser');
