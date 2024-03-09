import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useEffect } from 'react';
import axios from 'axios';
function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState({});
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };
  const checkUser = () => {
    const token = localStorage.getItem('uToken');
    if (token) {
      axios.get(`${apiEndpoint}/self`, {
        headers: {
          Authorization: token,
        },
      }).then((response) => {
        setUser(response.data);
      });
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Welcome to the 2024 edition of the Software Architecture course hola
      </Typography>
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
            Don't have an account? Register here.
          </Link>
        ) : (
          <Link component="button" variant="body2" onClick={handleToggleView}>
            Already have an account? Login here.
          </Link>
        )}
      </Typography>
    </Container>
  );
}

export default App;
