const bcrypt =require('bcrypt'); 
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/User');

router.post('/login', async (req, res) => {
  console.log("Trying to login...");
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password);

  try {
    let user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log("Stored password:", user.password, "Entered password:", password);

    // Directly compare the plain text password
    if (password !== user.password) {
      console.log("Invalid credentials: Passwords do not match");
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Creating payload for the JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Signing the JWT and sending it in the response body
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token in the response
    return res.json({ token });

  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ message: 'Server error' });
  }
});


// check if the user is still logged in with auth check
router.get('/auth-check', (req, res) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract token from 'Bearer <token>'
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    res.json({ user: decoded.user });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

  // Sign up route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      const boyrofilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`
      user = new User({
        username,
        email,
        password,
        profilePic: boyrofilePicture
      });
  
      ///const salt = await bcrypt.genSalt(10);
      //user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        return res.status(201).json({ token }); 
      });
  
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  });

  module.exports = router;
