// routes/busRoutes.js

const express = require('express');
const Train = require('../Models/Train'); // Adjusted to correctly import the Bus model

const router = express.Router();

// Route to fetch all bus details
router.get("/", async (req, res) => {
    try {
        const trains = await Train.find();
        if (trains.length === 0) {
            return res.status(404).json({ message: "No trains found." });
        }
        res.json(trains);
    } catch (err) {
        res.status(500).json({ message: "Error fetching trains: " + err.message });
    }
});

// Route to fetch bus details based on source and destination
router.get('/search', async (req, res) => {
    const { source, destination } = req.query;

    if (!source || !destination) {
        return res.status(400).json({ error: "Source and destination are required." });
    }
    try {
        const filteredTains = await Train.find({
            source: source,
            destination: destination
        });
        if (filteredTains.length === 0) {
            return res.status(404).json({ message: "No trains found for the specified route." });
        }

        res.json(filteredTains);
    } catch (err) {
        res.status(500).json({ message: "Error fetching trains: " + err.message });
    }
});

router.put('/update-trainseats', async (req, res) => {
  const { trainName, coachName, updatedSeats } = req.body;

  try {
    // Assuming you have a Train model in MongoDB
    const result = await Train.updateOne(
      { trainName, 'coaches.coachName': coachName },
      { $set: { 'coaches.$.noOfSeatsAvailable': updatedSeats } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Seats updated successfully' });
    } else {
      res.status(404).json({ message: 'Train or coach not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update seats', error });
  }
});

// Export the router
module.exports = router;
