import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button, createTheme, ThemeProvider , Box } from "@mui/material";
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
const UsersTasksTable = () => {
  const [data, setData] = useState([]); // State to hold the fetched data

  useEffect(() => {
    // Fetch data from the endpoint (replace with your actual endpoint)
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is needed
        const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/allUsersFinishedEvents', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Response", response.data);

        // Transform the data to fit the table structure
        const formattedData = response.data.flatMap(user => 
          user.finishedEvents.map(event => ({
            Nom: user.username,
            mail: user.email,
            tache: event.title,
            action: (
              <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="success"
                endIcon={<CheckCircleIcon />}
                sx={{ 
                  borderRadius: '20px', 
                  padding: '5px 15px',
                  textTransform: 'none'
                }}
                onClick={() => verifyTask(event._id , 'Tâche vérifier' )}
              >
                Tâche vérifier
              </Button>

              <Button 
                variant="outlined" 
                color="error"
                endIcon={<ReplayIcon />}
                sx={{ 
                  borderRadius: '20px', 
                  padding: '5px 15px',
                  textTransform: 'none'
                }}
                onClick={() => redoTask(event._id , 'Tâche à refaire')}
              >
                Tâche à refaire
              </Button>
            </Box>
            )
          }))
        );

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle task verification button click
  const verifyTask = async (taskId, title) => {
    console.log("Task verified:", taskId);
    console.log("Task title:", title);
  
    try {
      const token = localStorage.getItem('token'); // Retrieve JWT token
  
      // Step 1: Call the /eventDate endpoint to check the event status (LATE or ONTIME)
      const eventDateResponse = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/eventDate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: {
          eventId: taskId,
        }
      });
  
      const status = eventDateResponse.data.status; // Get "LATE" or "ONTIME"
  
      // Step 2: Based on the status, prepare data for the second request
      const data = {
        eventId: taskId,
        completedTask_onTime: status === "ONTIME" ? "true" : "false", // True if on time, false otherwise
        completedTask_lateFinished: status === "LATE" ? "true" : "false" // True if late, false otherwise
      };
  
      // Step 3: Call the /Completedevents endpoint to update the task status
      const completeTaskResponse = await axios.post('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/users/Completedevents', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      console.log("Task completion response:", completeTaskResponse.data);
  
    } catch (error) {
      console.error("Error on processing completing tasks:", error);
    }
  };
  

  const columns = [
    {
      name: "Nom",
      label: "Nom",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "mail",
      label: "Email",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "tache",
      label: "Tâche",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false
      }
    }
  ];

  const options = {
    responsive: "standard",
    selectableRows: 'none', // Hide the checkbox for rows
    elevation: 0, // Remove elevation
    rowsPerPage: 10, // Default rows per page
    rowsPerPageOptions: [5, 10, 15], // Pagination options
  };

   const redoTask = (taskId) => {
    console.log("Task to be redone:", taskId);
    // You can implement further actions like making an API call to update the task status
  };

  const getMuiTheme = () =>
    createTheme({
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: 'white', // White background
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', // Light shadow
              borderRadius: '8px', // Rounded corners
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: '#f5f5f5', // Light gray background for headers
              color: '#333', // Darker text for headers
              fontWeight: 'bold',
              fontSize: '1rem',
              padding: '10px',
              borderBottom: '2px solid #e0e0e0', // Subtle border
            },
            body: {
              fontSize: '0.9rem',
              color: '#555',
              padding: '10px',
              borderBottom: '1px solid #e0e0e0', // Light borders for rows
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none', // Avoid uppercase
              borderRadius: '20px', // Rounded button
              padding: '5px 15px',
              boxShadow: 'none', // Remove button shadow
              '&:hover': {
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Subtle hover shadow
              },
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              color: '#333', // Text color adjustment
            },
          },
        },
      },
    });

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={"Liste des Tâches"}
        data={data}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
}

export default UsersTasksTable;
