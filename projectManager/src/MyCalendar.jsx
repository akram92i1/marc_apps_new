import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './myCalendar.css';
import { Button, Box, TextField, Grid } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const MyCalendar = ({ events, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    console.log('We send those data to the calendar ===> ', events);
  }, [events]);

  const handleAddEvent = () => {
    const newEvent = { title, start: new Date(start), end: new Date(end) };
    onAddEvent(newEvent);
    setTitle('');
    setStart('');
    setEnd('');
  };

  const localizer = momentLocalizer(moment);

  const eventsWithDateObjects = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const eventStyleGetter = (event, start, end, isSelected) => {
    const today = new Date();
    let backgroundColor = '#3174ad';
    if (start < today) {
      backgroundColor = 'black';
    } else if (start >= today && start < new Date(today.setDate(today.getDate() + 7))) {
      backgroundColor = '#ff8c00';
    } else {
      backgroundColor = '#32cd32';
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
    <Grid container spacing={4}>
      {/* Calendar Section */}
      <Grid item xs={12} md={12}>
        <Box sx={{ height: 'auto', width: '100%', mb: 3 }}>
          <Calendar
            events={eventsWithDateObjects}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            style={{ minHeight: 400, height: '60vh', width: '100%' }}
          />
        </Box>
      </Grid>

      {/* Form Section */}
      <Grid item xs={12} md={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={3}>
              <TextField
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la tâche"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddEvent}
                sx={{ width: '100%', padding: '12px', mt: 2 }} // Lowered the button further with mt: 2
                startIcon={<EventAvailableIcon />}
              >
                Ajouter une tâche
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MyCalendar;
