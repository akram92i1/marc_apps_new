import React from 'react'
import MUIDataTable from 'mui-datatables';
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider
  } from "@mui/material/styles";

  const columns = [
    {
      name: "hero",
      label: "Superhero",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: false
      }
    }
  ];
  
  const data = [
    { name: "Bruce Wayne", hero: "Batman" },
    { name: "Clark kent", hero: "Superman" },
    { name: "Arthur Curry", hero: "Aquaman" }
  ];
  
  const options = {
    responsive: "standard"
  };
const UsersTasksTable = () => {
  return (
    <div>
      <MUIDataTable
          title={"Superheros List"}
          data={data}
          columns={columns}
          options={options}
        />
    </div>
  )
}

export default UsersTasksTable ; 