import React, { useEffect, useState } from 'react';
import { Card, Typography, CardHeader } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Task';
import PendingActionsIcon from '@mui/icons-material/PendingActions'; // Icon for pending status
import axios from 'axios';

const MyFinishedTaskComponent = ({ allFinishedEvents, setFinishedEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    const userId = await fetchUserId();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/finishedEvents`, { taskId: selectedEvent }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setFinishedEvents(allFinishedEvents.filter(event => event._id !== eventTaskId));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div>
      {Array.isArray(allFinishedEvents) && allFinishedEvents.length > 0 ? (
        allFinishedEvents.map((event, index) => {
          const newEvent = { ...event };
          newEvent.start = formatDate(newEvent.start);
          newEvent.end = formatDate(newEvent.end);
          return (
            <div key={event._id}>
              <Card
                key={index}
                variant="outlined"
                sx={{
                  maxWidth: 500,
                  bgcolor: '#e0f7e9', // Light green background to fit the white theme
                  color: '#4f4f4f',  // Gray text to fit the theme
                  height: "100%",
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: 2,  // Smooth rounded corners
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)', // Slight scale-up effect
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', // Deeper shadow effect
                  },
                }}
              >
                <CardHeader
                  sx={{ color: '#4f4f4f' }} // Gray text for the header
                  avatar={<FavoriteIcon sx={{ color: '#81c784' }} />}  // Light green icon to fit the theme
                  // Replace the settings action with the PendingActionsIcon
                  action={
                    <PendingActionsIcon sx={{ color: '#ff9800' }} />  // Orange pending validation icon
                  }
                  title={newEvent.title}
                  subheader={newEvent.start + " | " + newEvent.end}
                  subheaderTypographyProps={{ style: { color: '#757575', fontSize: '0.9rem' } }}  // Gray subheader text
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
          Pas de tâches encore effectuées.
        </Typography>
      )}
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

export default MyFinishedTaskComponent;
