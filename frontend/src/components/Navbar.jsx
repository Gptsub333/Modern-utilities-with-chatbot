import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Phone, Info, Lightbulb } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for screen size changes
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavigationLinks = () => (
    <>
      <a 
        href="/" 
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors 
        px-4 py-2 rounded-md text-base font-medium"
      >
        <Home className="mr-2" size={30} />
        Home
      </a>
      <a 
        href="#services" 
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors 
        px-4 py-2 rounded-md text-base font-medium"
      >
        <Menu className="mr-2" size={30} />
        Services
      </a>
      <a 
        href="/contact" 
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors 
        px-4 py-2 rounded-md text-base font-medium"
      >
        <Phone className="mr-2" size={30} />
        Contact
      </a>
      <a 
        href="/about" 
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors 
        px-4 py-2 rounded-md text-base font-medium"
      >
        <Info className="mr-2" size={30} />
        About
      </a>
    </>
  );

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-3">
          <Lightbulb className="h-8 w-auto sm:h-10 text-blue-600" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800">
            Modern Utilities
          </h1>
        </div>

        {/* Responsive Navigation */}
        {isMobile ? (
          <>
            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu} 
              className="text-black focus:outline-none"
            >
              <Menu size={24} />
            </button>

            {/* Mobile Navigation Overlay */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-white z-50">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-black">Modern Utilities</h1>
                    <button 
                      onClick={toggleMenu} 
                      className="text-black focus:outline-none"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <nav className="space-y-6 flex flex-col">
                    {NavigationLinks()}
                    {/* Mobile Get Started Button */}
                    <div className="mt-4">
                    <button className="w-full sm:w-auto py-4 px-8 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold 
                transition duration-300 ease-in-out shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Get Started
              </button>
                    </div>
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          // Desktop Navigation
          <div className="flex items-center justify-end w-full space-x-6">
            {/* Desktop Navigation Links */}
            <nav className="flex space-x-4 lg:space-x-6 items-center">
              {NavigationLinks()}
            </nav>

            {/* Desktop Get Started Button */}
            <div className="flex items-center">
            <button className="w-full sm:w-auto py-4 px-8 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold 
                transition duration-300 ease-in-out shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
