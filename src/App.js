import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Users from './pages/Users/Users';
import Comments from './pages/Comments/Comments';
import UserDetails from './pages/Users/UserDetails';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/comments" element={<Comments />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </>
  );
}

export default App;
