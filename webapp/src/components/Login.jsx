// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password }).then((res) => {
       
        if (res.status === 200) {
          if (signIn({
            auth: {
              token: res.data.token,
              type: 'Bearer'
            },
            // refresh: res.data.refreshToken,
            userState: {
              username: res.data.username,
              email: res.data.email,
              createdAt: res.data.createdAt
            }
          })) { // Only if you are using refreshToken feature
            // Redirect or do-something
            navigate('/');
          } else {
            //Throw error

            throw new Error('Error while signing in');
          }

        }    
      });

      setOpenSnackbar(true);
    } catch (error) {
      if(error.response===undefined){
        setError("Error: There was a problem...");
      }
      else{
        setError(error.response.data.error);
      }

    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <div>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         
        <Button variant="contained" color="primary" onClick={loginUser}>
          Login
        </Button>
        
        <Typography component="div" align="center" sx={{ marginTop: 2 }}>
          <Link to="/register">Don't have an account? Register here.</Link>
        </Typography>
        
      
       
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )}
      </div>

    </Container>
  );
};

export default Login;
