import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const RequireAuth = ({ children, onClose }) => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        <div className="bg-Nav_bar rounded-xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl text-white mb-4">Login Required</h2>
          <p className="text-gray-300 mb-6">You need to be logged in to view movie details and book tickets. Would you like to log in or register now?</p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-color_button hover:bg-color_hover text-white font-bold py-2 px-6 rounded"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
              >
                Register
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 font-medium py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAuth; 