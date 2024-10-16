import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Box, Divider } from '@mui/material';
import MyCalendar from './MyCalendar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import MyCardtaskComponent  from './Component/taskComponent' ; 
import  MyFinishedTaskComponent from "./Component/dataInfo" ; 
import Navbar from './Navbar';
import BarsDataset from './Component/stats';
import ChatComponent from './Component/Messaging/usersChatComponent' ; 
import UsersTasksTable from './Component/usersTasksTable';
export default function Home() {
    const [completedTasks, setCompletedTasks] = useState([]); // Example value
    const [totalTasks, setTotalTasks] = useState(10); // Example value
    const [events, setEvents] = useState([]);
    const [taskOnProgress , setTaskOnProgress ]  = useState([]) ; 
    const [open, setOpen] = useState(false);
    const [allEvents , setAllEvents] =  useState([]);
    const [allFinished , setFinishedEvents] = useState([]);
    const [allUsersTask , setAllUsersTask] =   useState([]);
    const [allUsersEvents , setAllUsersEvents] =   useState([]);
    const [userInformations , setUserInformation] = useState([]) ; 
    useEffect(() => {
        const fetchEvents = async () => {
            const userId = await fetchUserId(); // Fetch the userId first
            console.log("userId in fecthEvents",userId)
                console.log("userID",userId)
                try {
                    const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/events`, {
                        withCredentials: true, // Ensure cookies are sent with the request
                    }); 
                   setEvents(response.data);
                } catch (err) {
                    console.error(err);
                }
            
        };
        const fetchUserInformation = async () => {
            const userId = await fetchUserId(); 
            try {
                const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/userInformations`, {
                    withCredentials: true, // Ensure cookies are sent with the request
                });
                console.log("user information" , response.data )
                setUserInformation([response.data.username , response.data.imageUrl ])
            } catch (error) {
                console.error(error);
            }
            
        }
        const fecthFinishedEvents = async () => {
            const userId = await fetchUserId(); 
                try {
                    const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/finishedEvents`, {
                        withCredentials: true, // Ensure cookies are sent with the request
                    });
                    setCompletedTasks(response.data)
                } catch (error) {
                    console.error(error);
                }
         
        }
        const fecthAllUsersData = async () => {
              const userId = await fetchUserId(); 
              console.log("The new userId with the cookies is working fine ",userId)
              try {
                const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/allUsersEvents`, {
                    withCredentials: true, // Ensure cookies are sent with the request
                });
                console.log('Response Status:', response.status); // Check the response status
                console.log('Response Data:', response.data); // Log the response data
                if (response.status === 200) {
                  const allDataUsers = []
                  response.data.forEach((user)=> {
                    if (user.events && Array.isArray(user.events) && user.events.length > 0){
                        user.events.forEach((event) => {
                            allDataUsers.push({
                                title: user.username + " s'occupe de " + event.title,
                                start: event.start,
                                end: event.end,
                                _id: event._id,
                            });
                        });
                    }
                  })
                  setAllUsersTask(allDataUsers); // Update the state
                 
                //   const Events = buildAllEventsdata(allUsersTask) ; 
                //   console.log("All returned Events " ,Events)
                //   setAllUsersEvents(Events) ; 
                }
              } catch (error) {
                console.error(error);
              }
          };

        fetchEvents();
        fecthAllUsersData();
        fecthFinishedEvents();
        fetchUserInformation();
    }, []);

    const fetchUserId = async () => {
        try {
            const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/me', {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            console.log("RESPONSE : =====> ",response)
            return response.data.user; // Return the user ID from the response
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
      };

      const handleAddEvent = async (newEvent) => {
            const userId = await fetchUserId(); 
            console.log(userId);
            try {
                // Make a request to the server to save the event
                const response = await axios.post(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/events`, newEvent, {
                     withCredentials: true, // Ensure cookies are sent with the request
                });   
                // Check if the request is successful
                if (response.status === 201 || response.status === 200) {
                    // After successful save, update the local events list
                    const savedEvent = newEvent;  // The new event returned by the server (you can modify this based on the API response)
                    setEvents((prevEvents) => [...prevEvents, savedEvent]);  // Update local state
                }
            } catch (err) {
                console.error("Error adding event:", err);
            }       
    };

    const buildAllEventsdata = (data) => {
        const allDataUsers = [];
        console.log("data " , data)
        data.forEach((user) => {
            if (user.events && Array.isArray(user.events) && user.events.length > 0) {
                user.events.forEach((event) => {
                    allDataUsers.push({
                        title: user.username + " s'occupe de " + event.title,
                        start: event.start,
                        end: event.end,
                        _id: event._id,
                    });
                });
            }
        });
        console.log("here is the retturned value " , allDataUsers)
        return allDataUsers;
    }

    const fetchAllEvents = async () => {
            const userId = await fetchUserId(); 
            try { 
            const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/${userId}/events` , {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            console.log("here is data ",response.data) 
            setAllEvents(response.data);
            } catch (error) {
            console.error("Erroro :",error);
        }
          
      }; 
      console.log("Events",allUsersEvents)
      console.log("small events :",events)
    return (
        <div>
            <Navbar handleClickOpen={handleClickOpen} username={userInformations[0]} userImageUrl={userInformations[1]}  />
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={6}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={3} sx={{ height: '100%' }}>
                                <Box sx={{
                                background: 'white', padding: '5px', borderRadius: 1 , boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',  elevation: 6
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                                        <Typography>Statistiques</Typography>
                                    </Box>
                                    <Divider />
                                    <br />
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <BarsDataset></BarsDataset>
                                    </Box>
                                </Box>
                                <br />
                                <Box sx={{
                                background: 'white', padding: '5px', borderRadius: 1 , boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',  elevation: 6
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                                        <Typography>Diagramme des taches</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ChatComponent></ChatComponent>
                                    </Box>
                                </Box>
                        </Grid>
                        
                    {/* Main Content */}
                    <Grid item xs={12} md={6}>  
                        <Card sx={{ color: 'black', background: 'white'}}>
                            <Box sx= {{ background: '#dee2e6', padding: '5px', borderRadius: 1 , boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',  elevation: 6 }} >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,  }}>
                                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                        Calendrier
                                    </Typography>
                                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                        1er Janvier
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '100%', height: '100%' }}>
                                    <MyCalendar events={events} onAddEvent={handleAddEvent} />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Todo Bar */}
                    <Grid item xs={12} md={2} sx={{ height: '100%'  , justifyContent: 'flex-end' }}>
                        <Box sx={{ background: 'white', padding: '5px', borderRadius: 1 , boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',  elevation: 6 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                Taches courante
                            </Box>
                            <Divider/>
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <MyCardtaskComponent allEvents={events} setEvents={setEvents} allFinishedEvents = {completedTasks}   setFinishedEvents={setCompletedTasks}  />
                            </Box>
                        </Box>
                            <br />
                        <Box sx={{ background: 'white', padding: '5px', borderRadius: 1 , boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',  elevation: 6  }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                Taches Effectuer
                            </Box>
                            <Divider/>
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <MyFinishedTaskComponent allFinishedEvents = {completedTasks}  setFinishedEvents={setCompletedTasks}  />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                        <Box sx={{ background: 'white', padding: '5px', borderRadius: 1 , boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',  elevation: 6  }}>
                            <p>Messagerie</p>
                            <Divider/>
                            <br />   
        
                <UsersTasksTable>

                </UsersTasksTable>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
    </div>
    );
}
