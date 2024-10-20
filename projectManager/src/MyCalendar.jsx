import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer   } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './myCalendar.css';
import { Button , Box , TextField } from '@mui/material';
import axios from 'axios';
const MyCalendar = ({ events, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(()=> {
    console.log("we send those data to the calendar ===> " , events);
  });

  const handleAddEvent = () => {
    const newEvent = { title, start: new Date(start), end: new Date(end) };
    onAddEvent(newEvent);
    setTitle('');
    setStart('');
    setEnd('');
  };

  // Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer
console.log("Here we have the events that will be printed " , events) ; 
const eventsWithDateObjects = events.map((event) => ({
  ...event,
  start: new Date(event.start),
  end: new Date(event.end)
}));

// Function to customize the event style
const eventStyleGetter = (event, start, end, isSelected) => {
  const today = new Date();
  let backgroundColor = '#3174ad'; // default color
  let textColor = 'white';

  // Compare event start date with today's date
  if (start < today) {
    backgroundColor = 'black'; // Color for past events
  } else if (start >= today && start < today.setDate(today.getDate() + 7)) {
    backgroundColor = '#ff8c00'; // Orange for upcoming events within 7 days
  } else {
    backgroundColor = '#32cd32'; // Green for future events
  }


  return {
    style: {
      backgroundColor,
      color: 'white',
      borderRadius: '5px',
      border: 'none',
      display: 'block',
    },
  };
};

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <Calendar
      events={eventsWithDateObjects}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      eventPropGetter={eventStyleGetter}
      style={{ height: 700 }}
    />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <TextField
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          variant="outlined"
          margin="normal"
        />
        <TextField
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleAddEvent}
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </Box>
    </div>
  );
};
export default MyCalendar;