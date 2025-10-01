import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieList from "./MovieList";
import Navbar from "./Navbar";

import SwiperComponent from './SwiperComponent';
import Login from './Login';
import Footer from './Footer';
import Register from './Register';
import AdminPanel from './AdminPanel';
import AboutUs from './AboutUs';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <Navbar onSearch={setSearchQuery} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={
          <>
            {!searchQuery && <SwiperComponent />}
            <MovieList searchQuery={searchQuery} />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}