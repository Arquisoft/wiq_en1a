// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Snackbar } from '@mui/material';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const signIn = useSignIn();
  // const navigate = useNavigate();
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
            // navigate('/');
            window.location.href = '/';
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

    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        name="email"
        type='email'
        margin="normal"
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <TextField
        name="cpassword"

        margin="normal"
        fullWidth
        label="Confirm Password"
        type="password"
        value={cpassword}
        onChange={(e) => setcPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={addUser}>
        Register
      </Button>
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        <Link to="/login">Already have an account? Log in here.</Link>
      </Typography>


      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </Container>

  );
};

export default Login;
