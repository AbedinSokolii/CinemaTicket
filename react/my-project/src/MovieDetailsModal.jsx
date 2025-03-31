import { motion, AnimatePresence } from 'framer-motion';

const MovieDetailsModal = ({ movie, onClose }) => {
  return (
    <AnimatePresence>
      {movie && (
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
                <motion.img
                  src={movie.imageSrc}
                  alt={movie.imageAlt}
                  className="w-full h-auto rounded-lg shadow-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
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
                  className="flex gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="bg-red-600 px-3 py-1 rounded">HD</span>
                  <span className="text-yellow-400">★ 4.8/5</span>
                  <span>120 min</span>
                </motion.div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-gray-300">{movie.description}</p>
                </motion.div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-2">Showtimes</h3>
                  <div className="flex flex-wrap gap-2">
                    {['10:00 AM', '1:30 PM', '5:00 PM', '8:45 PM'].map((time) => (
                      <button
                        key={time}
                        className="bg-gray-700 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Tickets - {movie.price}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieDetailsModal;