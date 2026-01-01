import React from 'react';
import { FaEthereum } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-t border-indigo-500/30 mt-auto backdrop-blur-lg">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <FaEthereum className="text-cyan-400 text-sm sm:text-base" />
            <p className="text-white text-xs sm:text-sm">Ethereum Blockchain Explorer</p>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-right">
            © {new Date().getFullYear()} Built By Kartik Patil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

