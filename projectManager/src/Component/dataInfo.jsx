import CardContent from '@mui/material/CardContent';
import { Card, Typography, CardHeader, Popover } from "@mui/material";
import React, { useEffect } from 'react';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Task';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { jwtDecode } from 'jwt-decode';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
const MyFinishedTaskComponent = ({allFinishedEvents , setFinishedEvents}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const TaskState = ["Supprimer la tache" , "Archiver Tache"] ; 
    const [clickedEvent , setClickedEvent] = useState(null);
    const [activeEvent , setActiveEvent] = useState(null);
    const handleSettingsClick = (event , eventId) => {
      setAnchorEl(event.currentTarget);
      setSelectedEvent(eventId)
      console.log(eventId);
    };

    // useEffect(()=> {
    //     const fechtchNewFinishedEvents = async () => {
    //         const token = localStorage.getItem('token');
    //         if(token){
    //             const decoded = jwtDecode(token);
    //             const userId = decoded.user.id;
    //             try {
    //                const response = await axios.get(`http://127.0.0.1:5000/api/users/${userId}/finishedEvents` ,{
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //                }); 
    //                setFinishedEvents(response.data)
    //             }
    //              catch (error) {
    //                 console.log("Erroro",error)
    //             }
    //         }
    //     }
    //     fechtchNewFinishedEvents();
    // } , []);
  
    const handleTasktClick =  async() => {
      console.log("----- change the state of an event ------");
      const eventTaskId = selectedEvent;
      const token = localStorage.getItem('token') ; 
      if(token){
        const decoded = jwtDecode(token);
        const userId = decoded.user.id; 
        console.log("User id:",userId);
        try {
            const response = axios.post(`http://127.0.0.1:5000/api/users/${userId}/finishedEvents`,  { taskId: selectedEvent } , {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
          // Filter out the finished event from the current events
          setFinishedEvents(allFinishedEvents.filter(event => event._id == eventTaskId));
        } catch (error) {
          console.log("Erroro",error)
        }
      }
  
    }
  
    const handleClose = () => {
      setAnchorEl(null);
    };

   return (
    <div>
      {allFinishedEvents.map((event, index) => {
        // Create a new event object with the desired start format
        const newEvent = { ...event }; // Create a copy of the event object
        newEvent.start = formatDate(newEvent.start); // Format the start date
        newEvent.end =  formatDate(newEvent.end);
        return (
          <div key={event._id}>
            <Card key={index} variant="outlined" sx={{
              maxWidth: 500, 
              bgcolor: '#588157', 
              color: 'white', 
              height:"100%",
              marginBottom: 1,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Base shadow
              '&:hover': {
                boxShadow: '-5px -5px 5px rgba(0.5, 0.5, 0.5, 0.5)', // Hover shadow
              }
            }}>
              <CardHeader sx={{ color: 'white' }}
                avatar={<FavoriteIcon />}
                action={
                  <IconButton aria-label="settings" onClick={(event) => handleSettingsClick(event, newEvent._id)}>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={newEvent.title}
                subheader={newEvent.start+"|"+newEvent.end}
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
                <Typography sx={{ p: 2 }}  onClick={() => handleTasktClick()}>{TaskState[0]}</Typography>
                <Typography sx={{ p: 2 }}>{TaskState[1]}</Typography>
      </Popover>
    </div>
  );
}

// Function to format the date (replace with your desired formatting logic)
const formatDate = (timestamp) => {
    // ... your date formatting logic here
    // For example, you can use the same logic as in your previous response:
    const eventDate = new Date(timestamp);
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(eventDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  export default MyFinishedTaskComponent ; 
