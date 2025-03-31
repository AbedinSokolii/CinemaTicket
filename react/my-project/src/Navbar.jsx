import logo from './assets/logo.png';
import Button from './Button';
import { Link } from "react-router-dom"; 
import SearchBar from "./SearchBar"; 

function Navbar({ onSearch }) {
  return (
    <nav className="bg-Nav_bar p-4">
      <div className="flex justify-between items-center">
        <a className="size-12">
          <Link to="/"><img src={logo} alt="cinemato" /></Link>
        </a>

        <div className="space-x-4 flex">
          <SearchBar onSearch={onSearch} />

          <Link to="/login">
            <Button />
          </Link>
          <a href="#" className="text-red-600 hover:text-red-500 text-lg sm:max-lg:hidden max-sm:hidden py-1 px-4">
            Regjistrohu
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;