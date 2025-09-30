import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import MovieDetailsModal from './MovieDetailsModal';
import movieService from './services/movie.service';
import BookingModal from "./components/BookingModal";

function MovieList({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(false);


  useEffect(() => {
    loadMovies();
  }, []);

  const handleBooking = (bookingMovie) => {
    setBookingData(bookingMovie);
  }

  const topMovies = async () => {
    let topMovies = await movieService.getTopRatedMovies();
    setFilteredMovies(topMovies);
    setLoading(false);
  };

  const commingSoon = async () => {
    let fetchedMovies = await movieService.commingSoon();
    const commingSoon = fetchedMovies.filter((movie) => new Date(movie.releaseDate).toDateString() === new Date('1970-01-01').toDateString());
    setFilteredMovies(commingSoon);
    setLoading(false);
  };

  const loadMovies = async () => {
    try {
      const fetchedMovies = await movieService.getMovies();
      setMovies(fetchedMovies);
      setFilteredMovies(fetchedMovies);
      setLoading(false);
    } catch (err) {
      setError('Failed to load movies');
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      let filtered = movies;

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(movie =>
          movie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by date if selected
      if (selectedDate) {

        filtered = filtered.filter(movie => {
          const releaseDate = new Date(movie.releaseDate);
          const selectedDateObj = new Date(selectedDate);

          // Set both dates to start of day for comparison
          releaseDate.setHours(0, 0, 0, 0);
          selectedDateObj.setHours(0, 0, 0, 0);
          // console.log(releaseDate);
          // console.log(selectedDateObj);

          // Show the movie if it is on the same date:
          return (releaseDate.getDate() === selectedDateObj.getDate());
        });
      }

      setFilteredMovies(filtered);
      setIsSearching(searchQuery.length > 0 || selectedDate !== null);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDate, movies]);

  // Add a function to format the show times
  const formatShowTimes = (showTimes) => {
    return showTimes.join(', ');
  };

  if (loading) {
    return (
      <div className="bg-Bg_color min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-Bg_color min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-Bg_color">

      <div className="flex justify-center items-center gap-4  shadow-lg rounded-md ">
        <div className='dark:text-white sm:p-2  hover:bg-color_hover rounded-md' onClick={topMovies}>Top Movies</div>
        <div className='dark:text-white sm:p-2  hover:bg-color_hover rounded-md' onClick={commingSoon}>Comming Soon!</div>

      </div>
      <div className="mx-auto max-w-2xl px-4  sm:px-6 sm:py-2 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isSearching
              ? `Search Results (${filteredMovies.length})`
              : 'Beje zgjedhjen e filmave  tuaj'}
          </h2>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-mm-dd"
              placeholderText="Select date"
              className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              wrapperClassName="date-picker-wrapper"
              calendarClassName="custom-calendar"
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
            // filterDate={date => {
            //   const today = new Date(new Date().setHours(0, 0, 0, 0));
            //   return date >= today;
            // }}
            />
          </div>
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-10"
        >
          <AnimatePresence>
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  alt={movie.imageAlt}
                  src={movie.imageSrc}
                  className="aspect-square w-full rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-white">
                      <span className="absolute inset-0" />
                      {movie.name}
                    </h3>
                    <p className="mt-1 text-ellipsis overflow-hidden h-full max-h-40 text-sm text-gray-500">{movie.description}</p>
                    <p className="mt-1 text-sm text-gray-400">Show Times: {formatShowTimes(movie.showTimes)}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-400">{movie.price}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No movies found matching "{searchQuery}"</p>
          </motion.div>
        )}

        {bookingData && (
          <BookingModal
            movie={bookingData}
            // onClose={onClose}  // Close booking modal
          />
        )}

        {selectedMovie && (
          <MovieDetailsModal
            bookingData={handleBooking}
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}

      </div>
    </div>
  );
}

export default MovieList;