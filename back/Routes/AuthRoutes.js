// //without encryption
// const express = require('express');
// const User = require('../Models/User'); 
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// router.get("/", async (req, res) => {
//   try {
//       const users = await User.find();
//       if (users.length === 0) {
//           return res.status(404).json({ message: "No users found." });
//       }
//       res.json(users);
//   } catch (err) {
//       res.status(500).json({ message: "Error fetching users: " + err.message });
//   }
// });
// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log("Received signup data: ", req.body);
//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(400).json({ message: 'User already exists' });
//       }
//       user = new User({ name, email, password });
//       await user.save();
//       console.log("User saved successfully: ", user);
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       console.log("Generated token: ", token);
//       res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//     } catch (error) {
//       console.error('Error in signup:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });
//     if (user.password !== password) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     console.error('Error in login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// router.post('/forgot-password', async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Update the user's password directly
//     user.password = newPassword; // You should hash the password before saving
//     await user.save();

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error in forgot-password:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// module.exports = router;


// const express = require('express');
// const User = require('../Models/User'); 
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// // Get all users
// router.get("/", async (req, res) => {
//   try {
//       const users = await User.find();
//       if (users.length === 0) {
//           return res.status(404).json({ message: "No users found." });
//       }
//       res.json(users);
//   } catch (err) {
//       res.status(500).json({ message: "Error fetching users: " + err.message });
//   }
// });

// // Signup route
// router.post('/signup', async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log("Received signup data: ", req.body);
    
//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(400).json({ message: 'User already exists' });
//       }

//       // Directly saving the password without encryption
//       user = new User({ name, email, password });
//       await user.save();
      
//       console.log("User saved successfully: ", user);
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
//       res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//     } catch (error) {
//       console.error('Error in signup:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
  
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'User not found' });

//     // Directly comparing plain text password
//     if (user.password !== password) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (error) {
//     console.error('Error in login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Forgot password route
// router.post('/forgot-password', async (req, res) => {
//   const { email, newPassword } = req.body;

//   // Validate that newPassword is provided
//   if (!newPassword) {
//     return res.status(400).json({ message: 'New password is required' });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Update the user's password
//     user.password = newPassword; // You are assigning the new password here
//     await user.save(); // This should work fine if password is not missing

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error in forgot-password:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// const express = require('express');
// const User = require('../Models/User'); 
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// // Get all users
// router.get("/", async (req, res) => {
//   try {
//       const users = await User.find();
//       if (users.length === 0) {
//           return res.status(404).json({ message: "No users found." });
//       }
//       res.json(users);
//   } catch (err) {
//       res.status(500).json({ message: "Error fetching users: " + err.message });
//   }
// });

// // Signup route
// router.post('/signup', async (req, res) => {
//     const { name, email, password, mobile } = req.body;  // Capturing email or mobile depending on the mode
//     console.log("Received signup data: ", req.body);
    
//     try {
//       let user = await User.findOne({ email });
//       if (user) {
//         return res.status(400).json({ message: 'User already exists with this email' });
//       }

//       // Handle signup by mobile
//       if (mobile) {
//         user = await User.findOne({ mobile });
//         if (user) {
//           return res.status(400).json({ message: 'User already exists with this mobile' });
//         }
//       }

//       // Saving the user with either email or mobile
//       user = new User({ name, email, mobile, password });
//       await user.save();
      
//       console.log("User saved successfully: ", user);
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
//       res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
//     } catch (error) {
//       console.error('Error in signup:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   const { email, mobile, password } = req.body;
  
//   try {
//     // Find user by email or mobile
//     let user = null;
//     if (email) {
//       user = await User.findOne({ email });
//     } else if (mobile) {
//       user = await User.findOne({ mobile });
//     }

//     if (!user) return res.status(400).json({ message: 'User not found' });

//     // Directly comparing plain text password
//     if (user.password !== password) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
//   } catch (error) {
//     console.error('Error in login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Forgot password route
// router.post('/forgot-password', async (req, res) => {
//   const { email, mobile, newPassword } = req.body;

//   // Validate that newPassword is provided
//   if (!newPassword) {
//     return res.status(400).json({ message: 'New password is required' });
//   }

//   try {
//     // Find the user by email or mobile
//     let user = null;
//     if (email) {
//       user = await User.findOne({ email });
//     } else if (mobile) {
//       user = await User.findOne({ mobile });
//     }

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Update the user's password
//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.error('Error in forgot-password:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate the user via token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get all users (Admin use)
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users: " + err.message });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password, mobile } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        if (mobile) {
            user = await User.findOne({ mobile });
            if (user) {
                return res.status(400).json({ message: 'User already exists with this mobile' });
            }
        }

        user = new User({ name, email, mobile, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, mobile, password } = req.body;

    try {
        let user = null;
        if (email) {
            user = await User.findOne({ email });
        } else if (mobile) {
            user = await User.findOne({ mobile });
        }

        if (!user) return res.status(400).json({ message: 'User not found' });

        // Here you should ideally use bcrypt to compare hashed passwords
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email, mobile, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }

    try {
        let user = null;
        if (email) {
            user = await User.findOne({ email });
        } else if (mobile) {
            user = await User.findOne({ mobile });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword; // Ideally, hash the password before saving
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile (requires authentication)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile (requires authentication)
router.put('/profile', authenticateToken, async (req, res) => {
    const { name, email, mobile } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, email, mobile }, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user account (requires authentication)
router.delete('/delete-account', authenticateToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Check if user exists by email or mobile
router.post('/check-user-exist', async (req, res) => {
  const { email, mobile, name } = req.body;

  try {
      // Check for user by email
      if (email) {
          const userByEmail = await User.findOne({ email });
          if (userByEmail) {
              return res.status(200).json({ 
                  message: 'User already exists with this email. You can reset your password.', 
                  resetPassword: true 
              });
          }
      }

      // Check for user by mobile
      if (mobile) {
          const userByMobile = await User.findOne({ mobile });
          if (userByMobile) {
              return res.status(200).json({ 
                  message: 'User already exists with this mobile. You can reset your password.', 
                  resetPassword: true 
              });
          }
      }

      if (name) {
        const userByname = await User.findOne({ name });
        if (userByname) {
            return res.status(200).json({ 
                message: 'User already exists with this name. You can reset your password.', 
                resetPassword: true 
            });
        }
    }

      // If no user is found
      return res.status(404).json({ message: 'No user found with this name or mobile.' });

  } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
