import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UserChatDetail from './userChatDetail'
const MessageChatBox = ({ openChatBox, handleClosingChatBox }) => {
  useEffect(() => {
    console.log("component is loaded .. ", openChatBox);
  }, [openChatBox]);

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={openChatBox} onClose={handleClosingChatBox}>
        <DialogTitle>Chat with Test User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To sign up, please fill out the form below.
          </DialogContentText>
          <UserChatDetail></UserChatDetail>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosingChatBox} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default MessageChatBox;
