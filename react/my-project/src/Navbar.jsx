import logo from './assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { User, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from 'react';
import authService from './services/auth.service';

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user data whenever component mounts or route changes
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-Nav_bar p-4">
      <div className="flex justify-between items-center">
        <Link className="size-12" to="/"><img src={logo} alt="cinemato" /></Link>

        <div className="space-x-4 flex items-center">
          <SearchBar onSearch={onSearch} />

          {!user ? (
            <Link to="/login">
              <button className="bg-color_button hover:bg-color_hover text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                <User className="w-6 h-6" />
                <span className="sm:max-lg:hidden max-sm:hidden lg:flex">Login</span>
              </button>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="text-white">
                <span className="font-medium">Welcome, {user.user.firstName}</span>
              </div>
              {user.user.isAdmin && (
                <Link to="/admin">
                  <button className="bg-color_button hover:bg-color_hover text-white font-bold py-2 px-4 rounded flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    <span className="sm:max-lg:hidden max-sm:hidden lg:flex">Admin Panel</span>
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="sm:max-lg:hidden max-sm:hidden lg:flex">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;