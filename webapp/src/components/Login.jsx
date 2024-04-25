// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
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
      await axios.post(`${apiEndpoint}/login`, { username, password }).then((res) => {

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
            //window.location.href = '/';
          } else {
            //Throw error

            throw new Error('Error while signing in');
          }

        }
      });

      setOpenSnackbar(true);
    } catch (error) {
      if (error.response === undefined) {
        setError("Error: There was a problem...");
      }
      else {
        setError(error.response.data.error);
      }

    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="content-center justify-center bg-[#2E2F82] " style={{ height: "92.9vh" }}>
      <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }} className='bg-white rounded-xl content-center justify-center'>
        <h1 className='py-5 text-4xl font-bold text-[#111827]'>
          Access WIQ
        </h1>
        <TextField
          name="username"
          margin="normal"
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField

          name="password"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='py-5 content-center justify-center'>
          <Button variant="contained" className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={loginUser}>
            Log In
          </Button>
        </div>
        <Typography component="div" align="center" sx={{ marginTop: 2, marginBottom: 3 }}>
          <Link to="/register">New around here? Create account.</Link>
        </Typography>


        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )}
      </Container>
    </div>
  );
};

export default Login;
