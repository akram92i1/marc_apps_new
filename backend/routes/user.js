const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


//middleware to verify token    

const auth = (req, res, next) => {
  const token = req.cookies.token; // Access the token from the HTTP-only cookie
  console.log("token",token)
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach the decoded user info to req.user
    console.log("req user " , req.user.id);
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Assuming you have an auth middleware to verify the token
router.get('/me', auth, async (req, res) => {
  try {
    // The auth middleware attaches the decoded token to req.user
    res.json({ user: req.user.id });
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

//get all events for each user 
router.get('/:userId/allUsersEvents', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    const users = await User.find().populate('events').populate('finishedEvents');
    return res.status(200).json(users);
  } catch (err) {
    
    console.error(err.message);
    return res.status(500).send('servers error');
  }
});


// get all user information
router.post("/:userId/AllUserInformation" , auth , async (req , res)=>{
  const userId = req.user.id;
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
// Add an event
router.post('/:userId/events', auth, async (req, res) => {
  const userId = req.user.id;
  console.log("===> Before fetching user events ",userId)
  const { title, start, end } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found haha' });
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
  const userId = req.user.id;
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
    return res.status(201).json(user.finishedEvents);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Error adding finished event');
  }
});

// Get events
router.get('/:userId/events', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found HAHA ' });
    }
    // Filter out events that are already in finishedEvents
    const events_filtered = user.events.filter(event => {
      return !user.finishedEvents.some(finishedEvent => finishedEvent.taskId === event._id.toString());
      });
    return res.status(200).json(events_filtered);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});


router.get('/:userId/userInformations' , auth , async (req , res)=>{
  console.log("try to get some user informations !") ; 
  const userId = req.user.id; 
  try{
    const user = await User.findById(userId); 
    if(!user){
      return res.status(404).json({msg:'User not found'}) ; 

    }
    const userInformation_name = user.username
    const userInformation_urlpicture = user.profilePic
    console.log("here is some data about your   ")
    return res.json({username:userInformation_name , imageUrl: userInformation_urlpicture })
  }
  catch(err){
    return res.status(500).json({ message: 'Server error--->'+err });
  }
})

router.get('/:userId/finishedEvents' , auth , async (req , res)=> {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const finishedEventIds = user.finishedEvents.map(finishedEvent => finishedEvent.taskId);
    const finishedEvents = user.events.filter(event => finishedEventIds.includes(event._id.toString()));
    return res.json(finishedEvents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'No finished events yet !' });
  } 
})

router.post('/:userId/delete-event', (req, res) => {
  const eventId = req.body.eventId; // Get the event ID from the request body
  const userId = req.user.id;

  // Find the user document and pull the event from the events array
  User.findOneAndUpdate(
    { _id: userId },
    { $pull: { events: { _id: eventId } } },
    { safe: true, multi: true },
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error deleting event');
      } else {
        return res.send(`Event deleted successfully`);
      }
    } 
  );
});
module.exports = router;
