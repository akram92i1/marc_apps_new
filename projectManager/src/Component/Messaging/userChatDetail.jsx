

import React from "react";
import { Grid, List, ListItem, ListItemText, Divider, TextField, Fab } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    chatSection: {
      width: "100%",
      height: "80vh",
    },
    headBG: {
      backgroundColor: "#e0e0e0",
    },
    borderRight500: {
      borderRight: "1px solid #e0e0e0",
    },
    messageArea: {
      height: "70vh",
      overflowY: "auto",
    },
  });

const UserChatDetail = () => {
  const classes = useStyles();

  return (
    <Grid item xs={9}>
      <List >
        <ListItem key="1">
          <Grid container>
            <Grid item xs={12}>
              <ListItemText align="right" primary="Hey man, What's up ?" />
            </Grid>
            <Grid item xs={12}>
              <ListItemText align="right" secondary="09:30" />
            </Grid>
          </Grid>
        </ListItem>
        <ListItem key="2">
          <Grid container>
            <Grid item xs={12}>
              <ListItemText align="left" primary="Hey, I am Good! What about you ?" />
            </Grid>
            <Grid item xs={12}>
              <ListItemText align="left" secondary="09:31" />
            </Grid>
          </Grid>
        </ListItem>
        <ListItem key="3">
          <Grid container>
            <Grid item xs={12}>
              <ListItemText align="right" primary="Cool. I am good, let's catch up!" />
            </Grid>
            <Grid item xs={12}>
              <ListItemText align="right" secondary="10:30" />
            </Grid>
          </Grid>
        </ListItem>
      </List>
      <Divider />
      <Grid container style={{ padding: '20px' }}>
        <Grid item xs={11}>
          <TextField id="outlined-basic-email" label="Type Something" fullWidth />
        </Grid>
        <Grid xs={1} align="right">
          <Fab color="primary" aria-label="add">
            <SendIcon />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserChatDetail;
