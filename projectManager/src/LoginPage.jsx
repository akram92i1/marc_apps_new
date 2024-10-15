import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Avatar, CssBaseline, Grid, Link, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Cookies from 'js-cookie' ; 
const theme = createTheme();

const LoginPage = ({handleClickOpenSignup}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  useLayoutEffect(() => {
  
    const checkLoggedInUser = async () => {
      try {
        // Make a request to the backend to check if the user is authenticated
        const response = await axios.get('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/auth/auth-check', {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.status === 200) {
          // User is authenticated, navigate to the dashboard
          console.log("User is authenticated");
          navigate('/dashboard');
        }
      } catch (error) {
        // If token is expired or invalid, redirect to the login page
        console.error("Authentication failed or token expired:", error);
        navigate('/'); // Redirect to login page
      }
    };

    checkLoggedInUser();
  },  [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('')
    try{
    const response  = await axios.post('https://semer-le-present-f32d8fb5ce8e.herokuapp.com/api/auth/login', {email, password});
    const {token} = response.data;
    localStorage.setItem('token', token);

    //handle successful login here (store token, redirect user)
    navigate('/dashboard');
    }catch(err){
      setError(error.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h52">
                  Forgot password?
          </Typography>
          {error && <Alert severity = "error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled = {loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled = {loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
             Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Button variant='contained' onClick={handleClickOpenSignup}  >
                  SignUp
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
