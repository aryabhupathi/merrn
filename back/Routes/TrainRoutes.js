const express = require('express');
const Train = require('../Models/Train'); // Correctly importing the Train model

const router = express.Router();

// Route to fetch all train details
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

// Route to fetch train details based on source and destination
router.get('/search', async (req, res) => {
    const { source, destination } = req.query;

    if (!source || !destination) {
        return res.status(400).json({ error: "Source and destination are required." });
    }

    try {
        const filteredTrains = await Train.find({
            source: source,
            destination: destination
        });

        if (filteredTrains.length === 0) {
            return res.status(404).json({ message: "No trains found for the specified route." });
        }

        res.json(filteredTrains);
    } catch (err) {
        res.status(500).json({ message: "Error fetching trains: " + err.message });
    }
});

router.put('/update-train-seats', async (req, res) => {
  const { trainId, updatedCoaches } = req.body;

  if (!trainId || !updatedCoaches || updatedCoaches.length === 0) {
      return res.status(400).json({ message: 'Train ID and updated coaches are required' });
  }

  try {
      // Find the train by its unique trainId
      const train = await Train.findById(trainId);
      if (!train) {
          return res.status(404).json({ message: 'Train not found' });
      }

      // Update the available seats for each coach
      updatedCoaches.forEach(updatedCoach => {
          const coach = train.coaches.find(c => c.coachName === updatedCoach.coachName);
          if (coach) {
              // Ensure that the updated seats do not exceed the initial seat count
              if (updatedCoach.reservedSeats >= 0 && updatedCoach.reservedSeats <= coach.noOfSeatsAvailable) {
                  coach.noOfSeatsAvailable -= updatedCoach.reservedSeats; // Decrease the available seats
              }
          }
      });

      await train.save(); // Save updated train
      res.status(200).json({ message: 'Seats updated successfully', updatedTrain: train });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update seats', error });
  }
});


// Export the router
module.exports = router;
