import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddUser from './components/AddUser';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Rankings from './components/Rankings';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useEffect } from 'react';
import axios from 'axios';
import Game from './components/Game';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import MainPage from './components/MainPage';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState({});
  const isAuthenticated = useIsAuthenticated()
  const auth = useAuthUser();


  
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<AddUser />} />
        <Route path='/rankings' element={<Rankings />} />
        <Route path='/play' element={<Game />} />
      </Routes>
    </BrowserRouter>




    /* <Container component="main" maxWidth="xs">
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
    </Container> */
  )
}

export default App;
