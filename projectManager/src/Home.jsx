import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Box, Divider } from '@mui/material';
import {useNavigate} from 'react-router-dom' ; 
import MyCalendar from './MyCalendar';
import axios from 'axios';
import MyCardtaskComponent from './Component/taskComponent';
import MyFinishedTaskComponent from "./Component/dataInfo";
import Navbar from './Navbar';
import BarsDataset from './Component/stats';
import ChatComponent from './Component/Messaging/usersChatComponent';
import UsersTasksTable from './Component/usersTasksTable';

export default function Home() {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [taskOnProgress, setTaskOnProgress] = useState([]);
    const [open, setOpen] = useState(false);
    const [allEvents, setAllEvents] = useState([]);
    const [allFinished, setFinishedEvents] = useState([]);
    const [allUsersTask, setAllUsersTask] = useState([]);
    const [allUsersEvents, setAllUsersEvents] = useState([]);
    const [userInformations, setUserInformation] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [isSpecialUser, setIsSpecialUser] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchEvents = async () => {
            const userId = await fetchUserId();
            // console.log("userId in fetchEvents", userId);
            // console.log("userID", userId);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/events`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log("The current user event is set as follow "  , response.data); 
                setEvents(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const checkAuthentication = async () => {
            try{
                const token  = localStorage.getItem('token');
                // console.log("we are getting the token" , token)
                if(!token) {
                    console.error("No token found, redercting to login");
                    setAuthenticated(false);
                    navigate("/");
                    return ;
                }
                  // Make an authenticated request to check if the user is valid
                  const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/auth/auth-check', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if(response.status === 200){
                    // console.log("User authenticated --> ✔ ") ; 
                    setAuthenticated(true);  // Set authenticated to true only if successful
                }
            }catch (error){
                console.error('Authentication failed or token expired:', error);
                setAuthenticated(false);
                navigate("/");
            }
        }

        const fetchUserInformation = async () => {
            const userId = await fetchUserId();
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/userInformations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // console.log("user information", response.data);
                setUserInformation([response.data.username, response.data.imageUrl]);
                const username = response.data.username ; 
                // Check if the username is the special user
                if (username === 'marclavigne2020@gmail.com') {
                    setIsSpecialUser(true); // Set the special user state to true if it matches
                }
           
            } catch (error) {
                console.error(error);
            }
        };

        const fetchFinishedEvents = async () => {
            const userId = await fetchUserId();
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/finishedEvents`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCompletedTasks(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAllUsersData = async () => {
            const userId = await fetchUserId();
            // console.log("The new userId with the token is", userId);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/allUsersEvents`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // console.log('Response Status:', response.status);
                // console.log('Response Data:', response.data);
                if (response.status === 200) {
                    const allDataUsers = [];
                    response.data.forEach((user) => {
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
                    setAllUsersTask(allDataUsers);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkAuthentication();
        fetchEvents();
        fetchAllUsersData();
        fetchFinishedEvents();
        fetchUserInformation();

    }, [authenticated]);

    const fetchUserId = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log("RESPONSE : =====> ", response);
            return response.data.user;
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAddEvent = async (newEvent) => {
        const userId = await fetchUserId();
        // console.log(userId);
        try {
            const token = localStorage.getItem('token');
            // Make a request to the server to save the event
            const response = await axios.post(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/events`, newEvent, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // Check if the request is successful
            if (response.status === 201 || response.status === 200) {
                // After successful save, update the local events list
                const savedEvent = newEvent;  // The new event returned by the server
                setEvents((prevEvents) => [...prevEvents, savedEvent]);
            }
        } catch (err) {
            console.error("Error adding event:", err);
        }
    };

    const buildAllEventsData = (data) => {
        const allDataUsers = []; 
        // console.log("data", data);
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
        // console.log("here is the returned value", allDataUsers);
        return allDataUsers;
    };

    const fetchAllEvents = async () => {
        const userId = await fetchUserId();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/events`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            // console.log("here is data", response.data);
            setAllEvents(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // console.log("Events", allUsersEvents);
    // console.log("small events:", events);

    return (
        <div>
            <Navbar handleClickOpen={handleClickOpen} username={userInformations[0]} userImageUrl={userInformations[1]} />
            <Box sx={{ padding: 3 }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={3}>
                        <Box
                            sx={{
                                backgroundImage: 'linear-gradient(135deg, #fefae0  40%, #fae1dd 80%)', // Gradient from blue to white
                                padding: '5px',
                                borderRadius: 1,
                                boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Zoom-in effect
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                                <Typography>Statistiques</Typography>
                            </Box>
                            <Divider sx={{ backgroundColor: '#ccc', height: '2px' }} /> {/* Thicker and lighter divider */}
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <BarsDataset />
                            </Box>
                        </Box>
                        <br />
                        <Box
                            sx={{
                                backgroundColor : "#edede8", 
                                padding: '5px',
                                borderRadius: 1,
                                boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Zoom-in effect
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                                <Typography>Messagerie instantanée</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ChatComponent />
                            </Box>
                        </Box>
                    </Grid>

                    {/* Main Content (Calendar) */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                borderRadius: 2, // Rounded corners
                                padding: 2, // Padding inside the shadow box
                                backgroundColor: 'white', // Ensure the background remains white
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Zoom-in effect
                                },
                            }}
                        >
                            <Card sx={{ color: 'black', background: 'white' }}>
                                <Box sx={{ background: '#dee2e6', padding: '5px', borderRadius: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        </Box>
                    </Grid>

                    {/* Todo Bar */}
                    <Grid item xs={12} md={3}>
                        <Box
                            sx={{
                                backgroundImage: 'linear-gradient(135deg, #fae1dd 30%, #ffffff 100%)', // Gradient from blue to white
                                padding: '5px',
                                borderRadius: 1,
                                boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Zoom-in effect
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                Tâches courante
                            </Box>
                            <Divider sx={{ backgroundColor: '#ccc', height: '2px' }} />
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, width: '100%' }}>
                                <MyCardtaskComponent allEvents={events} setEvents={setEvents} allFinishedEvents={completedTasks} setCompletedTasks={setCompletedTasks} />
                            </Box>
                        </Box>
                        <br />
                        <Box
                            sx={{
                                backgroundColor:"#b2f7ef" , 
                                padding: '5px',
                                borderRadius: 1,
                                boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)', // Zoom-in effect
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                            Tâches Effectuer
                            </Box>
                            <Divider sx={{ backgroundColor: '#ccc', height: '2px' }} />
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <MyFinishedTaskComponent allFinishedEvents={completedTasks} />
                            </Box>
                        </Box>
                    </Grid>

                    {/* Special Section - Only for special user */}
                    {isSpecialUser && (
                        <Grid item xs={12} md={12} sx={{ height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                            <Box
                                sx={{
                                    backgroundImage: 'linear-gradient(135deg, #eff1ed 70%, #ffffff 100%)', // Gradient from blue to white
                                    padding: '5px',
                                    borderRadius: 1,
                                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.01)', // Zoom-in effect
                                    },
                                }}
                            >
                                <p>Section spéciale pour l'utilisateur : marclavigne2020@gmail.com</p>
                                <Divider sx={{ backgroundColor: '#ccc', height: '2px' }} />
                                <br />
                                <UsersTasksTable />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </div>
    );
}
