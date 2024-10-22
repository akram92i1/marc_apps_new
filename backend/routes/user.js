const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


//middleware to verify token    

// const auth = (req, res, next) => {
//   const token = req.cookies.token; // Access the token from the HTTP-only cookie
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     // Verify and decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user; // Attach the decoded user info to req.user
//     next();
//   } catch (err) {
//     console.error("Error verifying token:", err);
//     return res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

const auth = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token from 'Bearer <token>'
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token missing' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded User : ---> ", decoded)
    req.user = decoded.user; // Attach the decoded user info to req.user
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
router.get('/allUsersEvents', auth, async (req, res) => {
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
router.post("/AllUserInformation" , auth , async (req , res)=>{
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
router.post('/events', auth, async (req, res) => {
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
router.post('/finishedEvents', auth, async (req, res) => {
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
router.get('/events', auth, async (req, res) => {
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


router.get('/userInformations' , auth , async (req , res)=>{
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

router.get('/finishedEvents' , auth , async (req , res)=> {
  const userId = req.user.id;
  console.log("after calling the finished events with the userid" , userId)
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

router.post('/delete-event', auth  ,(req, res) => {
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



// Get finished events for all users
router.get('/allUsersFinishedEvents', auth, async (req, res) => {
  try {
    // Find all users and populate their events and finishedEvents
    const users = await User.find().populate('events').populate('finishedEvents');

    // Map through each user and filter out only their finished events
    const usersWithFinishedEvents = users.map(user => {
      // Get all task IDs from finishedEvents
      const finishedTaskIds = user.finishedEvents.map(event => event.taskId);

      // Filter user's events to return only finished events
      const finishedEvents = user.events.filter(event => finishedTaskIds.includes(event._id.toString()));
      return {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        finishedEvents: finishedEvents,  // Return only finished events for each user
      };
    });
    return res.status(200).json(usersWithFinishedEvents);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

router.post("/Completedevents", auth, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authentication token
    const eventId = req.body.eventId; // Get the event ID from the request body
    const { completedTask_onTime, completedTask_lateFinished } = req.body; // Get the additional attributes

    // Find the user by ID
    const user = await User.findById(userId).populate('finishedEvents');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find the event in the finishedEvents array
    const finishedEvent = user.finishedEvents.find(event => event._id.toString() === eventId);

    if (!finishedEvent) {
      return res.status(404).json({ msg: 'Event not found in FinishedEvents' });
    }

    // Create a new entry in the CompletedEvents array
    user.completedEvents.push({
      taskId: finishedEvent.taskId,
      month: finishedEvent.month,
      completedTask_onTime, // Use the data provided in the request
      completedTask_lateFinished, // Use the data provided in the request
    });

    // Remove the event from the FinishedEvents array
    user.finishedEvents = user.finishedEvents.filter(event => event._id.toString() !== eventId);

    // Save the user document with the changes
    await user.save();

    return res.status(200).json({ msg: 'Event moved to CompletedEvents successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
