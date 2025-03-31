import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import SwiperComponent from './SwiperComponent';
import Login from './Login';
import Footer from './Footer';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Router>
      <Navbar onSearch={setSearchQuery} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <>
            {!searchQuery && <SwiperComponent />}
            <Header searchQuery={searchQuery} />
            <Footer/>
          </>
        } />
      </Routes>
    </Router>
  );
}