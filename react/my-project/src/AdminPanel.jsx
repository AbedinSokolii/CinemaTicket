import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from './components/RequireAuth';
import authService from './services/auth.service';
import movieService from './services/movie.service';
import { Pencil, Trash2, Plus, Star, X } from 'lucide-react';

const AdminPanel = () => {
  const [movies, setMovies] = useState([]);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieData, setMovieData] = useState({
    name: '',
    description: '',
    imageSrc: '',
    imageAlt: '',
    price: '',
    duration: '',
    rating: 4.5,
    showTimes: [],
    releaseDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableTimes] = useState([
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ]);

  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.user?.isAdmin;

  useEffect(() => {
    loadMovies();
  }, []);

  // Add useEffect for escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isAddingMovie) {
        resetForm();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isAddingMovie]);

  const loadMovies = async () => {
    try {
      const fetchedMovies = await movieService.getMovies();
      setMovies(fetchedMovies);
    } catch (err) {
      setError('Failed to load movies');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center p-4">
        <div className="bg-Nav_bar rounded-xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl text-white mb-4">Access Denied</h2>
          <p className="text-gray-300">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData(prev => ({
      ...prev,
      [name]: name === 'showTimes' ? value.split(',').map(t => t.trim()) : value
    }));
  };

  const resetForm = () => {
    setMovieData({
      name: '',
      description: '',
      imageSrc: '',
      imageAlt: '',
      price: '',
      duration: '',
      rating: 4.5,
      showTimes: [],
      releaseDate: new Date().toISOString().split('T')[0]
    });
    setEditingMovie(null);
    setIsAddingMovie(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.id, movieData);
        setSuccess('Movie updated successfully!');
      } else {
        await movieService.createMovie(movieData);
        setSuccess('Movie added successfully!');
      }
      await loadMovies();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setMovieData({
      ...movie,
      releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0]
    });
    setIsAddingMovie(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        setSuccess('Movie deleted successfully!');
        await loadMovies();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleTimeClick = (time) => {
    const newShowTimes = movieData.showTimes.includes(time)
      ? movieData.showTimes.filter(t => t !== time)
      : [...movieData.showTimes, time].sort();
    
    setMovieData(prev => ({
      ...prev,
      showTimes: newShowTimes
    }));
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    
    // Remove any existing dollar signs
    value = value.replace(/\$/g, '');
    
    // If it's a valid number
    if (!isNaN(value) && value !== '') {
      // Format with dollar sign
      value = `$${value}`;
    }
    
    setMovieData(prev => ({
      ...prev,
      price: value
    }));
  };

  const handleDurationChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, '');
    
    // If it's a valid number
    if (!isNaN(value) && value !== '') {
      // Format with "min"
      value = `${value} min`;
    }
    
    setMovieData(prev => ({
      ...prev,
      duration: value
    }));
  };

  // Add handleOverlayClick function
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      resetForm();
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black/90 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Movie Management</h1>
            <button
              onClick={() => setIsAddingMovie(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Movie
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {success}
            </div>
          )}

          {/* Movie Form Modal */}
          <AnimatePresence>
            {isAddingMovie && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                onClick={handleOverlayClick}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-Nav_bar rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                >
                  <button
                    onClick={resetForm}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {editingMovie ? 'Edit Movie' : 'Add New Movie'}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white mb-2">Movie Title</label>
                        <input
                          type="text"
                          name="name"
                          value={movieData.name}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={movieData.duration}
                          onChange={handleDurationChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                          placeholder="Enter minutes"
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2">Price</label>
                        <input
                          type="text"
                          name="price"
                          value={movieData.price}
                          onChange={handlePriceChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                          placeholder="Enter amount"
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2">Rating (0-5)</label>
                        <input
                          type="number"
                          name="rating"
                          value={movieData.rating}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2">Release Date</label>
                        <input
                          type="date"
                          name="releaseDate"
                          value={movieData.releaseDate}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-white mb-2">Show Times</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => handleTimeClick(time)}
                              className={`p-2 rounded text-sm ${
                                movieData.showTimes.includes(time)
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-white mb-2">Image URL</label>
                        <input
                          type="url"
                          name="imageSrc"
                          value={movieData.imageSrc}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-white mb-2">Image Alt Text</label>
                        <input
                          type="text"
                          name="imageAlt"
                          value={movieData.imageAlt}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded p-2"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-white mb-2">Description</label>
                        <textarea
                          name="description"
                          value={movieData.description}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded p-2 h-32"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        {editingMovie ? 'Update Movie' : 'Add Movie'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Movies List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-Nav_bar rounded-xl overflow-hidden"
              >
                <img
                  src={movie.imageSrc}
                  alt={movie.imageAlt}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{movie.name}</h3>
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Star size={16} fill="currentColor" />
                    <span>{movie.rating}/5</span>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-2">{movie.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">{movie.price}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default AdminPanel; 