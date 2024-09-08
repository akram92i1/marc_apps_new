const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


//middleware to verify token    
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const tokenVer = verifiedToken(token , {returnPayload:true})
  if (!tokenVer) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  console.log("verifiedToken" , tokenVer)
    req.user = tokenVer.user;
    next();
  };

const verifiedToken = async (token , options=undefined) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return options?.returnPayload ? decoded : true;
  } catch (err) {
    return false;
  }
}


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
// Login route
// router.post('/login', async (req, res) => {
//   // Extract email and password from request body
//   const { email, password } = req.body;
//   console.log("email" , email);
//   console.log("password" , password); 
//   try {
//     // Find user by email
//     let user = await User.findOne({ email });
//     if (!user) {
//       // If user not found, return invalid credentials message
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Check if password matches (Note: This is not secure, should use bcrypt)
//     const isMatch = password == user.password;
//     if (!isMatch) {
//       // If password doesn't match, return invalid credentials message
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Create payload for JWT
//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     // Sign JWT
//     jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       // Send token in response
//       res.json({ token });
//     });

//   } catch (err) {
//     // Log error and send server error message
//     console.error(err.message);
//     res.status(500).send( {message:'Server error'});
//   }
// });

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
  console.log("try to get some user informations !") ; 
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
    res.status(500).json({ message: 'Server error--->'+err });
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
    res.status(500).json({ message: 'No finished events yet !' });
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
