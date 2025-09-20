import logo from './assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from 'react';

function SubMenu({ onSearch }) {
  // const navigate = useNavigate();
  // const [user, setUser] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <nav className="bg-Nav_bar p-4">
      <div className="flex justify-between items-center">
      <h1>test</h1>
            </div>
    </nav>
  );
}

export default SubMenu;