import { motion, AnimatePresence } from 'framer-motion';
import RequireAuth from './components/RequireAuth';
import { Star, Clock, Calendar, Ticket } from 'lucide-react';

const MovieDetailsModal = ({ movie, onClose }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      {movie && (
        <RequireAuth onClose={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-Nav_bar rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl z-10"
              >
                ✕
              </button>

              {/* Movie Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Column - Movie Poster */}
                <div className="lg:w-1/2 p-6">
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.img
                      src={movie.imageSrc}
                      alt={movie.imageAlt}
                      className="w-full h-auto rounded-lg shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center pb-4">
                      <span className="text-white text-lg font-medium">Click to enlarge</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Movie Details */}
                <div className="lg:w-1/2 p-6 text-white">
                  <motion.h2
                    className="text-3xl font-bold mb-4"
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                  >
                    {movie.name}
                  </motion.h2>

                  <motion.div 
                    className="flex flex-wrap gap-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="bg-red-600 px-3 py-1 rounded flex items-center gap-2">
                      <Clock size={16} />
                      {movie.duration}
                    </span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Star size={16} fill="currentColor" />
                      {movie.rating}/5
                    </span>
                    <span className="text-gray-300 flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(movie.releaseDate)}
                    </span>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Ticket size={20} />
                      Available Showtimes
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {movie.showTimes.map((time) => (
                        <motion.button
                          key={time}
                          className="bg-gray-700 hover:bg-red-600 px-4 py-2 rounded transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.button
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium mt-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Ticket size={20} />
                    Book Tickets - {movie.price}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </RequireAuth>
      )}
    </AnimatePresence>
  );
};

export default MovieDetailsModal;