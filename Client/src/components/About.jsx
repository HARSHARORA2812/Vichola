import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import MiiscoImage from '../images/matchmaking.webp'; 
import { SiMarriott } from 'react-icons/si';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const [hoveredPoint, setHoveredPoint] = useState(0);

  const points = [
    {
      title: 'Community-Centric',
      description:
        'We are dedicated to serving the Maheshwari community by providing a platform that respects and upholds our cherished traditions. Our app focuses exclusively on Maheshwari singles, ensuring that you find a partner who shares your cultural values and beliefs.',
    },
    {
      title: 'Advanced AI-Based Matching',
      description:
        'Leveraging the latest in AI technology, our app uses advanced algorithms to analyze and match profiles based on character traits, preferences, and compatibility. This ensures that every match is not only based on traditional criteria but also on modern compatibility factors.',
    },
    {
      title: 'Comprehensive Compatibility Analysis',
      description:
        'Our matchmaking process integrates traditional Gunn matching with AI-based preference and character matching. This comprehensive approach ensures a higher success rate and more harmonious relationships.',
    },
    {
      title: 'User-Friendly Experience',
      description:
        'Our app is designed with you in mind. With an intuitive interface and seamless navigation, finding your life partner is just a few clicks away. Whether you are browsing profiles or setting your preferences, our app makes the process simple and enjoyable.',
    },
    {
      title: 'Privacy and Security',
      description:
        'We value your privacy and security above all. Our app employs state-of-the-art security measures to protect your personal information, ensuring a safe and trustworthy environment for your matrimonial journey.',
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-center pt-16">
        <motion.div className="text-center mb-16 banner h-52 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-100">About Us</h1>
        </motion.div>
      </div>

      <motion.div className="min-h-screen flex flex-col items-center mb-16 bg-gray-50 p-6 md:p-10 space-y-10">
        <div className="relative w-full md:w-1/2 flex justify-center p-4">
          <div className="relative w-60 h-60 md:w-80 md:h-80">
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg">
              <Image src={MiiscoImage} alt="miisco" className="rounded-full" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 lg:w-1/2 p-4 text-gray-700">
          <h1 className="text-4xl font-bold mb-4 tracking-wide flex items-center space-x-3">
            <SiMarriott className="w-8 h-8 text-blue-500" />
            <span>Why Us</span>
          </h1>
          <div className="flex flex-col md:flex-row justify-between mx-4 md:mx-10 my-10 space-y-5 md:space-y-0">
            <div className="hidden relative md:flex md:flex-col justify-between space-y-4 md:space-y-0 md:mr-10">
              {points.map((point, index) => (
                <div
                  key={index}
                  className={`p-4 bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform ${
                    hoveredPoint === index ? 'scale-105 bg-blue-100' : 'bg-white'
                  } hover:shadow-xl`}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onClick={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(0)}
                >
                  <span className="text-sm font-semibold text-gray-800">{point.title}</span>
                </div>
              ))}
            </div>

            <ul className="space-y-5 text-lg leading-relaxed mt-5 md:mt-0 w-full">
              {points.map((point, index) => (
                <li
                  key={index}
                  className={`flex items-start space-x-3 transition-opacity ${
                    hoveredPoint === index ? 'opacity-100' : 'opacity-70'
                  } md:${hoveredPoint === index ? 'block' : 'hidden'} block md:flex`}
                >
                  <span className="text-blue-500 font-semibold">•</span>
                  <span>
                    <strong className="text-gray-900">{point.title}:</strong> {point.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div className="flex flex-col items-center mb-16 rounded-xl bg-gradient-to-r from-gray-500 to-teal-400 p-10 mx-4 md:mx-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-6">Our Values</h1>
        <div className="w-full flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 p-4">
            <div className="p-6 bg-white rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Innovation</h2>
              <p className="text-gray-600 leading-relaxed">
                We believe in constantly pushing the boundaries of what is possible, using cutting-edge technology to deliver innovative solutions that make a real difference.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="p-6 bg-white rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Integrity</h2>
              <p className="text-gray-600 leading-relaxed">
                Our commitment to integrity means we always do what is right, ensuring our clients can trust us to deliver on our promises and act with honesty and transparency.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="p-6 bg-white rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Community</h2>
              <p className="text-gray-600 leading-relaxed">
                We are dedicated to making a positive impact in our community, supporting local initiatives and working together to create a better future for everyone.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="container mx-auto p-4">
        <div className="bg-gradient-to-r w-full md:w-9/12 lg:w-7/12 mx-auto from-fuchsia-200 to-purple-200 rounded-lg p-6 mb-8 shadow-lg overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            To connect Maheshwari singles worldwide by providing a reliable, secure, and user-friendly platform that fosters meaningful relationships and lifelong partnerships.
          </p>
        </div>
      </motion.div>

      <motion.div className="container mx-[80px] p-4">
        <div className="bg-gradient-to-r w-full md:w-9/12 lg:w-7/12 mx-auto from-fuchsia-200 to-purple-200 rounded-lg p-6 mb-8 shadow-lg overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            To be the most trusted and preferred matrimonial app for the Maheshwari community, known for our commitment to quality, integrity, and innovation.
          </p>
        </div>
      </motion.div>

      <motion.div className="container mx-auto p-4">
        <div className="bg-gradient-to-r w-full md:w-9/12 lg:w-7/12 mx-auto from-fuchsia-200 to-purple-200 rounded-lg p-6 mb-8 shadow-lg overflow-hidden">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Us on This Journey</h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            We invite you to be a part of this exciting journey. Create your profile today and let the Smart Maheshwari Matrimonial App help you find your perfect match. Together, we can make your dream of finding a life partner a reality.
          </p>
          <p className="text-lg text-gray-800 leading-relaxed">
            For more information and updates, follow us on our social media channels and stay connected with MisscoLpp.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default AboutUs;
