import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Use direct image imports
import product from './assets/movie1.jpeg';
import product_1 from './assets/borebardha_1.png';
import product_2 from './assets/mufasa.jpg';
import product_3 from './assets/miki.png';

const products = [
  {
    id: 1,
    name: 'gone never back',
    href: '#',
    imageSrc: product,
    imageAlt: "Movie poster",
    price: '$35',
    description: 'a child that loved his dad',
  },
  {
    id: 2,
    name: 'gone never back',
    href: '#',
    imageSrc: product_1,
    imageAlt: "Movie poster",
    price: '$35',
    description: 'a child that loved his dad',
  },
  {
    id: 3,
    name: 'Ur dad back with milk',
    href: '#',
    imageSrc: product_2,
    imageAlt: "Movie poster",
    price: '$35',
    description: 'Filmi fillon : 27.03.2025',
  },
  {
    id: 4,
    name: 'Miki Mouse Adventure',
    href: '#',
    imageSrc: product_3,
    imageAlt: "Movie poster",
    price: '$35',
    description: 'Animated classic',
  },
  {
    id: 5,
    name: 'Miki Mouse Adventure',
    href: '#',
    imageSrc: product_3,
    imageAlt: "Movie poster",
    price: '$35',
    description: 'Animated classic',
  }
];

function Header({ searchQuery }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsSearching(searchQuery.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="bg-Bg_color">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {isSearching 
            ? `Search Results (${filteredProducts.length})`
            : 'Beje zgjedhjen e filmave tjuj'}
        </h2>

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
                className="group relative"
              >
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="aspect-square w-full rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-white">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-400">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No movies found matching "{searchQuery}"</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Header;