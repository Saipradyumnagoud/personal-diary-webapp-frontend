import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Main from './Components/Main/Main';
import Login from './Components/Login/Login';
import Entry from './Components/Entry/Entry';
const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />

          <Route path="/entry/:date" element={<Entry />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
