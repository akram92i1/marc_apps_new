import React, { useState } from 'react';
import { Calendar, momentLocalizer   } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './myCalendar.css';
import { Button , Box , TextField } from '@mui/material';

const MyCalendar = ({ events, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

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
const eventsWithDateObjects = events.map((event) => ({
  ...event,
  start: moment(event.start).toDate(),
  end: moment(event.end).toDate(),
}));
  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <Calendar
      events={eventsWithDateObjects}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
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
