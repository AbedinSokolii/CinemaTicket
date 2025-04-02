import { User } from "lucide-react";
// Removed the import for Login since we are now using react-router-dom Link
const Button2 = () => {
    return (
        <button className="bg-color_button hover:bg-color_hover text-white font-bold py-2 px-4 rounded flex items-center gap-2">
            <User className="w-6 h-6" />

            <span className="sm:max-lg:hidden max-sm:hidden lg:flex">Regjistrohu</span>
        </button>
    );
};

export default Button2;
