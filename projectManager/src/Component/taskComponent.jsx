import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Card, Avatar, Divider, Box, Typography, CardHeader, Popover, IconButton } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Icon } from '@mui/material';
const MyCardtaskComponent = ({ allEvents, setEvents, allFinishedEvents, setFinishedEvents }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventMonth, setSelectedEventMonth] = useState(null);
  const TaskState = ["Tache effectue", "Tache supprime"];
  const [token, setToken] = useState();
  const handleSettingsClick = (event, eventId, eventEndDate) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventId);
    const dateObject = new Date(eventEndDate);
    const monthIndex = dateObject.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[monthIndex];
    setSelectedEventMonth(monthName);
  };

  useEffect(() => {
    const fetchNewFinishedEvents = async () => {
        const userId = await fetchUserId();
              try {
        const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/finishedEvents`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
  
        setToken(response.data.token);
        setFinishedEvents(response.data);
      } catch (error) {
        console.error("Error fetching finished events:", error);
      }
      
   

    };
  
    fetchNewFinishedEvents();
    console.log("Component has changed");
  }, [allEvents]);
  

  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use(config => {  
      config.headers.Authorization = 
      !config._retry && token ? `Bearer ${token}`
      : config.headers.Authorization;
      return config;});
      return () => { 
        axios.interceptors.request.eject(authInterceptor);
      };
  }, [token]);
  const fetchUserId = async () => {
    try {
        const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/me', {
            withCredentials: true, // Ensure cookies are sent with the request
        });
        return response.data.user; // Return the user ID from the response
    } catch (err) {
        console.error("Error fetching user info:", err);
    }
};
  const handleTasktClick = async () => {
    console.log("----- Change the state of an event ------");
    const eventTaskId = selectedEvent;
    const token = localStorage.getItem('token');
    const userId = await fetchUserId(); 
    console.log("User ID:", userId);
      try {
        await axios.post(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/finishedEvents`, {
          taskId: selectedEvent,
          month: selectedEventMonth
        }, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        // Filter out the finished event from the current events
        setEvents(allEvents.filter(event => event._id !== eventTaskId));
      } catch (error) {
        console.log("Error:", error);
      }
 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {allEvents.map((event, index) => {
        const newEvent = { ...event };
        newEvent.start = formatDate(newEvent.start);
        newEvent.end = formatDate(newEvent.end);
        
        const today = new Date();
        const startDate = new Date(event.start);
        const dateDiff = Math.abs(startDate - today);
        const color = getDateColor(dateDiff);
        const componentTextColor = getTextColor(color);

        return (
          <div key={event._id}>
            <Card key={index} variant="outlined" sx={{
              maxWidth: 500, 
              bgcolor: color, 
              color: componentTextColor, 
              height: "100%",
              marginBottom: 1,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Base shadow
              '&:hover': {
                boxShadow: '-5px -5px 5px rgba(0.5, 0.5, 0.5, 0.5)', // Hover shadow
              }
            }}>
              <CardHeader sx={{ color: 'dark' }}
                avatar={<ArrowCircleRightIcon />}
                action={
                  <IconButton aria-label="settings" onClick={(event) => handleSettingsClick(event, newEvent._id, newEvent.end)}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={newEvent.title}
                subheader={newEvent.start + " | " + newEvent.end}
                subheaderTypographyProps={{ style: { color: '#ff6700' } }}
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

const getDateColor = (dateDiff) => {
  if (dateDiff < 86400000) { // less than 1 day
    return '#ff0000'; // red
  } else if (dateDiff < 604800000) { // less than 1 week
    return '#ff8fa3'; // orange
  } else {
    return '#a2d2ff'; // blue
  }
};

const getTextColor = (color) => {
  if (color === '#ff0000') {
    return "white";
  } else if (color === '#ff8fa3') {
    return "white"; 
  } else {
    return "#f26419"; 
  }
};


export default MyCardtaskComponent;
