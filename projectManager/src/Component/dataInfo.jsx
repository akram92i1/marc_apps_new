import React, { useEffect, useState } from 'react';
import { Card, Typography, CardHeader, Popover } from "@mui/material";
import CardContent from '@mui/material/CardContent';
import FavoriteIcon from '@mui/icons-material/Task';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';

const MyFinishedTaskComponent = ({ allFinishedEvents, setFinishedEvents }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const TaskState = ["Supprimer la tache", "Archiver Tache"];

  const handleSettingsClick = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventId);
    console.log(eventId);
  };

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.user; // Return the user ID from the response
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const handleTasktClick = async () => {
    console.log("----- change the state of an event ------");
    const eventTaskId = selectedEvent;
    const userId = await fetchUserId();
    console.log("User id:", userId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/finishedEvents`, { taskId: selectedEvent }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Filter out the finished event from the current events
      setFinishedEvents(allFinishedEvents.filter(event => event._id !== eventTaskId));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {allFinishedEvents.map((event, index) => {
        // Create a new event object with the desired start format
        const newEvent = { ...event }; // Create a copy of the event object
        newEvent.start = formatDate(newEvent.start); // Format the start date
        newEvent.end = formatDate(newEvent.end);
        return (
          <div key={event._id}>
            <Card
              key={index}
              variant="outlined"
              sx={{
                maxWidth: 500,
                bgcolor: '#588157',
                color: 'white',
                height: "100%",
                marginBottom: 1,
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '-5px -5px 5px rgba(0.5, 0.5, 0.5, 0.5)',
                },
              }}
            >
              <CardHeader
                sx={{ color: 'white' }}
                avatar={<FavoriteIcon />}
                action={
                  <IconButton aria-label="settings" onClick={(event) => handleSettingsClick(event, newEvent._id)}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={newEvent.title}
                subheader={newEvent.start + " | " + newEvent.end}
                subheaderTypographyProps={{ style: { color: 'white' } }}
              />
            </Card>
          </div>
        );
      })}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography sx={{ p: 2 }} onClick={handleTasktClick}>{TaskState[0]}</Typography>
        <Typography sx={{ p: 2 }}>{TaskState[1]}</Typography>
      </Popover>
    </div>
  );
};

// Function to format the date
const formatDate = (timestamp) => {
  const eventDate = new Date(timestamp);
  const year = eventDate.getFullYear();
  const month = String(eventDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  const day = String(eventDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default MyFinishedTaskComponent;
