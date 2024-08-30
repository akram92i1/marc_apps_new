import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import {Alert} from '@mui/material';
const theme = createTheme();

export default function SignupDialog({openSignup, handleCloseSignup}){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [Uservalidation, setUserValidation] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/users/signup', { username, email, password });
      console.log(response.data);
      setUserValidation('User registred Sucessfully');
      handleCloseSignup();
    } catch (error) {
      console.error('There was an error creating the user!', error);
      setError('Failed to sign up Email already registred');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={openSignup} onClose={handleCloseSignup}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To sign up, please fill out the form below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />

           {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
       {Uservalidation && (
        <Alert variant="filled" severity="success">
          {Uservalidation}
        </Alert>
      )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignup} color="primary">
            Cancel
          </Button>
          <Button  onClick={handleSubmit} color="primary">
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

