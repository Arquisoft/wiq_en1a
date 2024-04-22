import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddUser from './components/AddUser';
import Navbar from './components/Navbar';
import Login from './components/Login';
import RankingsLayout from './components/ranking/RankingLayout';
import Game from './components/Game';
import MainPage from './components/MainPage';
import Squads from './components/Squads';
import UserProfile from './components/UserProfile';


function App() {
  // const isAuthenticated = useIsAuthenticated() // True if user has logged in
  // const auth = useAuthUser(); // User data: {username,emial,createdAt} To add fields go to Login
  // IDK how it works


  
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<AddUser />} />
        <Route path='/rankings' element={<RankingsLayout />} />
        <Route path='/play' element={<Game />} />
        <Route path='/squads' element={<Squads />} />
        <Route path='/userprofile' element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
