import React, { useEffect, useState } from 'react';
import { Card, Typography, CardHeader, Popover, IconButton, Divider } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

const MyCardtaskComponent = ({ allEvents, setEvents, allFinishedEvents, setFinishedEvents }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventMonth, setSelectedEventMonth] = useState(null);
  const [removingEventId, setRemovingEventId] = useState(null);
  const TaskState = ["Tache effectuée"];
  const [slideOut, setSlideOut] = useState(false);

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
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/finishedEvents`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setFinishedEvents(response.data);
      } catch (error) {
        console.error("Error fetching finished events:", error);
      }
    };
    fetchNewFinishedEvents();
  }, [allEvents, setFinishedEvents]);

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data.user;
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const handleTasktClick = async () => {
    const eventTaskId = selectedEvent;
    const token = localStorage.getItem('token');
    const userId = await fetchUserId();

    try {
      setRemovingEventId(eventTaskId);
      setSlideOut(true);
      setTimeout(async () => {
        await axios.post(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/finishedEvents`, {
          taskId: selectedEvent,
        }, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        setEvents((prevEvents) => prevEvents.filter(event => event._id !== eventTaskId));
        setSlideOut(false);
      }, 500);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {Array.isArray(allEvents) && allEvents.length > 0 ? (
        allEvents.map((event, index) => {
          const newEvent = { ...event };
          newEvent.start = formatDate(newEvent.start);
          newEvent.end = formatDate(newEvent.end);

          const today = new Date();
          const startDate = new Date(event.start);
          const dateDiff = Math.abs(startDate - today);
          const color = getDateColor(dateDiff);
          const componentTextColor = getTextColor(color);
          const isRemoving = event._id === removingEventId;

          return (
            <div key={event._id} className={`event-card ${isRemoving && slideOut ? 'slide-out' : ''}`}>
              <Card
                key={index}
                variant="outlined"
                sx={{
                  bgcolor: color,
                  color: componentTextColor,
                  height: "100%",
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: 2,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)', // Slight scale-up effect
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', // Deeper shadow effect
                  },
                }}
              >
                <CardHeader
                  sx={{ color: componentTextColor }}
                  avatar={<ArrowCircleRightIcon sx={{ color: '#4f4f4f' }} />}
                  action={
                    <IconButton aria-label="settings" onClick={(event) => handleSettingsClick(event, newEvent._id, newEvent.end)}>
                      <MoreVertIcon sx={{ color: '#4f4f4f' }} />
                    </IconButton>
  
                  }
                  title={<Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: componentTextColor }}>
                  {newEvent.title}
                </Typography>}
                  subheader={ <Typography  variant="caption" sx={{ fontSize: '0.9rem', color: componentTextColor }}>
                       {newEvent.start + " | " + newEvent.end}
                  </Typography>}
                  subheaderTypographyProps={{ style: { color: '#4f4f4f', fontSize: '0.9rem' } }}
                />
              </Card>
            </div>
          );
        })
      ) : (
        <Typography
          sx={{
            p: 1,
            color: 'gray',
            fontSize: '1rem',
            textAlign: 'center',
            margin: 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            fontWeight: 500,
          }}
        >
          Pas de tâches encore ajoutées.
        </Typography>
      )}
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
        <Typography
          sx={{
            p: 2,
            cursor: 'pointer',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
          }}
          onClick={handleTasktClick}
        >
          {TaskState[0]}
        </Typography>
      </Popover>
    </div>
  );
};

const formatDate = (timestamp) => {
  const eventDate = new Date(timestamp);
  const year = eventDate.getFullYear();
  const month = String(eventDate.getMonth() + 1).padStart(2, '0');
  const day = String(eventDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateColor = (dateDiff) => {
  if (dateDiff < 86400000) {
    return '#ffcccb'; // soft red for urgent tasks
  } else if (dateDiff < 604800000) {
    return '#ffd580'; // light orange for moderately urgent tasks
  } else {
    return '#d4f1f4'; // light blue for less urgent tasks
  }
};

const getTextColor = (color) => {
  if (color === '#ffcccb' || color === '#ffd580') {
    return "#4f4f4f"; // dark gray for contrast on lighter backgrounds
  } else {
    return "#1e3a4f"; // darker blue text for blue background
  }
};

export default MyCardtaskComponent;
