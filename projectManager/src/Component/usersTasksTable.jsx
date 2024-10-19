import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import {
    Button,
    createTheme,
    StyledEngineProvider,
    ThemeProvider
  } from "@mui/material";
import axios from 'axios';

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
      console.log("Response" , response.data )
        // Transform the data as per your structure
        // const formattedData = response.data.map(task => ({
        //   Nom: task.name,
        //   mail: task.email,
        //   tache: task.taskTitle,
        //   action: (
        //     <Button 
        //       variant="contained" 
        //       color="primary"
        //       onClick={() => verifyTask(task._id)}
        //     >
        //       Tache vérifier
        //     </Button>
        //   )
        // }));

        //setData(formattedData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

  fetchData();
  }, []);

  // Function to handle task verification button click
  const verifyTask = (taskId) => {
    console.log("Task verified:", taskId);
    // You can implement further actions like making an API call to update the task status
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
    responsive: "standard"
  };

  return (
    <div>
      <MUIDataTable
          title={"Liste des Tâches"}
          data={data}
          columns={columns}
          options={options}
        />
    </div>
  )
}

export default UsersTasksTable;
