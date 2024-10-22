import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import MessageChatBox from "./chatComponent";

const ChatComponent = () => {
  const [openChatBox, setOpenChatBox] = useState(false);

  const handleOpeneChatBox = () => {
    console.log("Setting open chat box to true");
    setOpenChatBox(true);
  };

  const handleCloseChatBox = () => {
    setOpenChatBox(false);
  };

  return (
    <div>
      <Grid container spacing={4} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Box
            sx={{
              background: "#f5ebe0", // Light background
              padding: "10px",
              borderRadius: 2,
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Shadow effect
              width: "100%",
              display: "flex",
              justifyContent: "space-between", // Align items to opposite sides
              alignItems: "center", // Center align vertically
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "left", // Align the text to the left
                color: "#333",
              }}
            >
              Chat
            </Typography>
            <IconButton color="primary">
              <MessageIcon />
            </IconButton>
          </Box>

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
            <ListItem button key="CindyBaker" onClick={handleOpeneChatBox}>
              <ListItemIcon>
                <Avatar
                  alt="Cindy Baker"
                  src="https://material-ui.com/static/images/avatar/2.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker" />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      {/* Chat Box */}
      {openChatBox && (
        <MessageChatBox
          openChatBox={openChatBox}
          handleClosingChatBox={handleCloseChatBox}
        />
      )}
    </div>
  );
};

export default ChatComponent;
