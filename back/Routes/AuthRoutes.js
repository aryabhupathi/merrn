const express = require('express');
const User = require('../Models/User'); // This already uses the 'abc' collection via the model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    console.log("Received signup data: ", req.body); // Debugging: check if data is being received correctly
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user
      user = new User({ name, email, password });
  
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // Save the user in the 'abc' collection
      await user.save(); // Debugging: Check if this is executed
  
      console.log("User saved successfully: ", user); // Debugging: log success
  
      // Create and sign a token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Return the token and user details
      res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Error in signup:', error); // Debugging: log the error
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email from the 'abc' collection
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create and sign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and user details
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
