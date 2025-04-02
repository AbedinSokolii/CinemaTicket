import logo from './assets/logo.png';
import Button from './Button';
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Route } from 'lucide-react';
import Button2 from "./Button2";
function Navbar({ onSearch }) {
  return (
    <nav className="bg-Nav_bar p-4">
      <div className="flex justify-between items-center">
        <Link className="size-12" to="/"><img src={logo} alt="cinemato" /></Link>

        <div className="space-x-4 flex">
          <SearchBar onSearch={onSearch} />

          <Link to="/login">
            <Button />
          </Link>
          <Link to="/register">
            <Button2 />
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;