import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieDetailsModal from './MovieDetailsModal'; // Add this import
// ... keep your existing imports ...

function Header({ searchQuery }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // Add this state

  // ... keep your existing useEffect ...

  return (
    <div className="bg-Bg_color">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* ... keep existing header content ... */}

        <motion.div 
          layout
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-10"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedMovie(product)} // Add this
              >
                {/* ... keep existing card content ... */}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Add the modal at the bottom */}
        <MovieDetailsModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />

        {/* ... keep no results section ... */}
      </div>
    </div>
  );
}

export default Header;