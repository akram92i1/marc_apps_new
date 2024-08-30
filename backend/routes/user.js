const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
const auth = (req, res, next) => {
  console.log("Header ---> ",req.header('Authorization'))
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg:  'Token is not valid' });
  }
};

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

//get all events for each user 
router.get('/:userId/allUsersEvents', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const users = await User.find().populate('events').populate('finishedEvents');
    return res.status(200).json(users);
  } catch (err) {
    
    console.error(err.message);
    return res.status(500).send('Serverrr error');
  }
});


// get all user information
router.post("/:userId/AllUserInformation" , auth , async (req , res)=>{
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const users = await User.find().populate('username').populate("profilePic");
    res.json(users)
  } catch (error) {
    console.error("there is an error with users.. ")
  }
})
// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("email" , email);
  console.log("password" , password); 
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send( {message:'Server error'});
  }
});

// Add an event
router.post('/:userId/events', auth, async (req, res) => {
  const { userId } = req.params;
  const { title, start, end } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const newEvent = { title, start, end };
    user.events.push(newEvent);
    await user.save();
    // Filter out events that are already in finishedEvents
    const events_filtered = user.events.filter(event => 
      !user.finishedEvents.some(finishedEvent => finishedEvent.taskId === event._id.toString())
      && !user.finishedEvents.includes(event._id.toString())
    );
    res.status(201).json(events_filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a finishedEvent 
router.post('/:userId/finishedEvents', auth, async (req, res) => {
  const { userId } = req.params;
  const { taskId, month } = req.body
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Akram yaw User not found' });
    }
    // Check if finishedEvents field exists, if not, add it
    if (!user.finishedEvents) {
      user.finishedEvents = [];
    }
    const newFinishedEvent = { taskId ,  month};
    user.finishedEvents.push(newFinishedEvent);
    await user.save();
    res.status(201).json(user.finishedEvents);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error adding finished event');
  }
});

// Get events
router.get('/:userId/events', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Filter out events that are already in finishedEvents
    const events_filtered = user.events.filter(event => {
      return !user.finishedEvents.some(finishedEvent => finishedEvent.taskId === event._id.toString());
      });
    res.status(200).json(events_filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/:userId/userInformations' , auth , async (req , res)=>{
  const {userId}= req.params ; 
  try{
    const user = await User.findById(userId); 
    if(!user){
      return res.status(404).json({msg:'User not found'}) ; 

    }
    const userInformation_name = user.username
    const userInformation_urlpicture = user.profilePic
    console.log("here is some data about your   ")
    res.json({username:userInformation_name , imageUrl: userInformation_urlpicture })
  }
  catch(err){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

router.get('/:userId/finishedEvents' , auth , async (req , res)=> {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const finishedEventIds = user.finishedEvents.map(finishedEvent => finishedEvent.taskId);
    const finishedEvents = user.events.filter(event => finishedEventIds.includes(event._id.toString()));
    res.json(finishedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } 
})

router.post('/:userId/delete-event', (req, res) => {
  const eventId = req.body.eventId; // Get the event ID from the request body
  const userId = req.body.userId; // Get the user ID from the request body

  // Find the user document and pull the event from the events array
  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { events: { _id: eventId } } },
    { safe: true, multi: true },
    (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error deleting event');
      } else {
        res.send(`Event deleted successfully`);
      }
    } 
  );
});


module.exports = router;
