const bcrypt =require('bcrypt'); 
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

     
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("email" , email);
    console.log("password" , password); 
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send( {message:'Server error'});
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
  
      const boyrofilePicture = `https://avatar.iran.liara.run/public/boy?username={username}`
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
        res.status(201).json({ token }); 
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  module.exports = router;