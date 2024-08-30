import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import MessageChatBox from "./chatComponent";
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

const ChatComponent = () => {
  const classes = useStyles();
  const [openChatBox, setOpenChatBox] = useState(false);

  const handleOpeneChatBox = () => {
    console.log("setting open chat box to true");
    setOpenChatBox(true);
  };

  const handleCloseChatBox = () => {
    setOpenChatBox(false);
  };

  return (
    <div>
        <Grid container spacing={6}>
          <Grid item xs={12} md={3} sx={{ height: "100%" }}>
            <Box
              sx={{
                background: "white",
                padding: "5px",
                borderRadius: 1,
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
                elevation: 6,
              }}
            />
            <Grid container>
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    background: "white",
                    padding: "5px",
                    borderRadius: 1,
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
                    elevation: 6,
                  }}
                >
                  <Typography variant="h5" className="header-message">
                    Chat
                  </Typography>
                </Box>
              </Grid>
              <List>
                <ListItem button key="RemySharp">
                  <ListItemIcon>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://material-ui.com/static/images/avatar/1.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText primary="John Wick" />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem button key="Alice">
                  <ListItemIcon>
                    <Avatar
                      alt="Alice"
                      src="https://material-ui.com/static/images/avatar/3.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText primary="Alice" />
                </ListItem>
                <ListItem button key="CindyBaker">
                  <ListItemIcon>
                    <Avatar
                      alt="Cindy Baker"
                      src="https://material-ui.com/static/images/avatar/2.jpg"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cindy Baker"
                    onClick={handleOpeneChatBox}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Grid>
        <MessageChatBox  openChatBox={openChatBox}  handleClosingChatBox={handleCloseChatBox} ></MessageChatBox>
    </div>
  );
};

export default ChatComponent;
