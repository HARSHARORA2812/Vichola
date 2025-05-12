import React from 'react';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 py-5 px-5 lg:px-10">
      <motion.div
        className="container mx-auto flex flex-col lg:flex-row lg:justify-between gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-full lg:w-1/2 flex flex-col gap-2 text-left mb-5 lg:mb-0"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-black italic text-xl text-pink-500">Vichola Matrimonials App</h1>
          <p className="text-xs leading-relaxed text-gray-400">
            Welcome to Vichola, your trusted app for finding the perfect match within the community. Our advanced features help you connect based on character, preferences, income, and more, ensuring meaningful and compatible matches. Join us today and start your journey towards a happy and harmonious partnership.
          </p>
          <p className="text-xs font-semibold text-gray-400">
            Office Address: Chitkara University, Rajpura, Punjab, India
          </p>
          <hr className="my-4 border-gray-600" />
        </motion.div>

        <motion.div
          className="w-full lg:w-1/4 text-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="font-bold mb-2 text-lg text-pink-500">Company</h1>
          <hr className="my-1 border-gray-600 w-8/12 mx-auto" />
          <ul>
            <li className="mb-1"><a href="/about" className="text-xs text-gray-400 hover:text-pink-500">About Us</a></li>
            <li className="mb-1"><a href="/contact" className="text-xs text-gray-400 hover:text-pink-500">Contact Us</a></li>
            <li className="mb-1"><a href="/careers" className="text-xs text-gray-400 hover:text-pink-500">Career</a></li>
          </ul>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/4 text-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.75 }}
        >
          <h1 className="font-bold mb-2 text-lg text-pink-500">Legal</h1>
          <hr className="my-1 border-gray-600 w-8/12 mx-auto" />
          <ul>
            <li className="mb-1"><a href="/termsandconditions" className="text-xs text-gray-400 hover:text-pink-500">Terms & Conditions</a></li>
            <li className="mb-1"><a href="/terms/privacy" className="text-xs text-gray-400 hover:text-pink-500">Privacy Policy</a></li>
            <li className="mb-1"><a href="/terms/termofuse" className="text-xs text-gray-400 hover:text-pink-500">Terms of Use</a></li>
            <li className="mb-1"><a href="/helpAndSupport" className="text-xs text-gray-400 hover:text-pink-500">FAQ's</a></li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        className="container mx-auto flex flex-col lg:flex-row lg:justify-between items-center py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <p className="text-xs text-gray-400 mb-2 lg:mb-0">© 2024 All Rights Reserved</p>
        <div className="flex items-center justify-center gap-4">
          <motion.a
            href="https://www.twitter.com/"
            aria-label="Twitter"
            className="mx-2"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <FaTwitter size={25} className="text-pink-500 hover:text-pink-700 transition-all" />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/"
            aria-label="LinkedIn"
            className="mx-2"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <FaLinkedin size={25} className="text-pink-500 hover:text-pink-700 transition-all" />
          </motion.a>
          <motion.a
            href="https://www.instagram.com/"
            aria-label="Instagram"
            className="mx-2"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <FaInstagram size={25} className="text-pink-500 hover:text-pink-700 transition-all" />
          </motion.a>
          <motion.a
            href="https://www.facebook.com/"
            aria-label="Facebook"
            className="mx-2"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <FaFacebook size={25} className="text-pink-500 hover:text-pink-700 transition-all" />
          </motion.a>
        </div>
      </motion.div>
    </footer>
  );
}
