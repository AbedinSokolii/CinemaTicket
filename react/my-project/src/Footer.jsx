import { motion } from 'framer-motion';
import logo from './assets/logo.png';
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: 'Home', href: '/' },
    { name: 'Movies', href: '/movies' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' }
  ];

  const socialLinks = [
    { 
      icon: <Facebook className="w-6 h-6" />, 
      href: '#',
      label: "Facebook" 
    },
    { 
      icon: <Twitter className="w-6 h-6" />, 
      href: '#',
      label: "Twitter" 
    },
    { 
      icon: <Instagram className="w-6 h-6" />, 
      href: '#',
      label: "Instagram" 
    },
    { 
      icon: <Youtube className="w-6 h-6" />, 
      href: '#',
      label: "YouTube" 
    }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-Nav_bar text-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="space-y-4"
          >
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-10 w-auto"
            />
            <p className="text-gray-300 text-sm">
              Your premier destination for the latest movies and entertainment.
            </p>
          </motion.div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

        {/* Social Links - Fixed */}
<div>
  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
  <div className="flex space-x-4">
    {socialLinks.map((social, index) => (
      <motion.a
        key={index}
        href={social.href}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.9 }}
        className="bg-gray-700 p-2 rounded-full hover:bg-red-500 transition-colors"
        aria-label={social.label} 
      >
        <span className="sr-only">{social.label}</span>
        {social.icon}
      </motion.a>
    ))}
  </div>
</div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-2">
              Subscribe to get updates on new releases.
            </p>
            <form className="flex">
          
             
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} CINEMA COMPANY THE STATE OF MOVIES.</p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;