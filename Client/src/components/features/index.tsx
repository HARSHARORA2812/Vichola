import { motion } from 'framer-motion';
import tabBg from '../../images/tab-bg.jpg';
import AiMatches from '../../images/screenshots/ai-matches.jpeg';
import PersonalizedPreferences from '../../images/screenshots/v.jpeg';
import Astro from '../../images/screenshots/astro.jpeg';
import Seamless from '../../images/screenshots/seamless.jpeg';
import Cp from '../../images/screenshots/cp.jpeg';

// Define animation variants
const animationVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 100 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 50,
    },
  },
};

const iconVariants = {
  hidden: { rotate: 0 },
  visible: {
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const Comp1 = () => (
  <motion.div
    className="relative w-full max-w-4xl bg-white h-auto bg-opacity-90 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center p-6 lg:p-10"
    style={{
      backgroundImage: `url('${tabBg}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}
    variants={animationVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="absolute inset-0 bg-texture bg-no-repeat bg-cover opacity-20"></div>
    <motion.div className="relative z-10 w-full lg:w-1/2 text-left p-6" variants={animationVariants}>
      <motion.h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center" variants={iconVariants}>
        <span className="mr-3">
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </span>
        Automatic AI-Powered Matching
      </motion.h1>
      <p className="text-base lg:text-lg text-gray-700 mb-4">
        Matches optimized for compatibility with the power of artificial intelligence, bringing you closer to your ideal partner.
      </p>
      <ul className="list-disc list-inside text-gray-700">
        <li>Customizable preferences</li>
      </ul>
    </motion.div>
    <motion.div className="relative lg:w-1/2 flex justify-center lg:justify-evenly" variants={animationVariants}>
  <img
    src={Cp}
    alt="AI Matching"
    className="w-3/4 h-auto max-w-xs lg:max-w-lg rounded-lg shadow-lg z-20 overflow-hidden"
    style={{ maxHeight: '500px' }} // Adjust this value based on your requirements
  />
</motion.div>

  </motion.div>
);



// Comp2
const Comp2 = () => (
  <motion.div
    className="relative w-full max-w-4xl bg-white h-auto bg-opacity-90 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center p-6 lg:p-10"
    style={{
      backgroundImage: `url('${tabBg}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}
    variants={animationVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="absolute inset-0 bg-texture bg-no-repeat bg-cover opacity-20"></div>
    <div className="relative z-10 w-full lg:w-1/2 text-left p-6">
      <motion.h1
        className="text-xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="mr-3">
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5v14" />
          </svg>
        </span>
        Astrology Integration
      </motion.h1>
      <p className="text-base lg:text-lg text-gray-700 mb-4">
        Automatic Astrology Information Matching for personalized astrological insights.
      </p>
      <ul className="list-disc list-inside text-gray-700">
        <li>Accurate astrological predictions</li>
        <li>AI-based Astrology Gunn Matching</li>
        <li>Get Rid of Manual Matching</li>
      </ul>
    </div>
    <div className="relative lg:w-1/2 flex justify-center lg:justify-evenly">
      <img
        src={PersonalizedPreferences}
        alt="Astrology Integration"
        className="w-3/4 h-auto max-w-xs lg:max-w-lg rounded-lg shadow-lg z-20 overflow-hidden"
        style={{ maxHeight: '500px' }} // Adjust this value based on your requirements
      />
    </div>
  </motion.div>
);

// Comp3
const Comp3 = () => (
  <motion.div
    className="relative w-full max-w-4xl bg-white h-auto bg-opacity-90 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center p-6 lg:p-10"
    style={{
      backgroundImage: `url('${tabBg}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}
    variants={animationVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="absolute inset-0 bg-texture bg-no-repeat bg-cover opacity-20"></div>
    <div className="relative z-10 w-full lg:w-1/2 text-left p-6">
      <motion.h1
        className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="mr-3">
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 7-7 7-7-7z" />
          </svg>
        </span>
        Exclusive to Maheshwari Community
      </motion.h1>
      <p className="text-base lg:text-lg text-gray-700 mb-4">
        Find your ideal match within a niche, like-minded Maheshwari group.
      </p>
      <ul className="list-disc list-inside text-gray-700">
        <li>Focused on community values</li>
        <li>Exclusive network of profiles</li>
      </ul>
    </div>
    <div className="relative lg:w-1/2 flex justify-center lg:justify-evenly">
      <img
        src={AiMatches}
        alt="Exclusive to Maheshwari Community"
        className="w-3/4 h-auto max-w-xs lg:max-w-lg rounded-lg shadow-lg z-20 overflow-hidden"
    style={{ maxHeight: '500px' }} // Adjust this value based on your requirements
      />
    </div>
  </motion.div>
);

// Comp4
const Comp4 = () => (
  <motion.div
    className="relative w-full max-w-4xl bg-white h-auto bg-opacity-90 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center p-6 lg:p-10"
    style={{
      backgroundImage: `url('${tabBg}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}
    variants={animationVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="absolute inset-0 bg-texture bg-no-repeat bg-cover opacity-20"></div>
    <div className="relative z-10 w-full lg:w-1/2 text-left p-6">
      <motion.h1
        className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="mr-3">
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3z" />
          </svg>
        </span>
        Personalized Preferences
      </motion.h1>
      <p className="text-base lg:text-lg text-gray-700 mb-4">
        Customize your match preferences based on hobbies, interests, and more.
      </p>
      <ul className="list-disc list-inside text-gray-700">
        <li>Filter by lifestyle choices</li>
        <li>Tailor matches to your preferences</li>
      </ul>
    </div>
    <div className="relative lg:w-1/2 flex justify-center lg:justify-evenly">
      <img
        src={Astro}
        alt="Personalized Preferences"
        className="w-3/4 h-auto max-w-xs lg:max-w-lg rounded-lg shadow-lg z-20 overflow-hidden"
        style={{ maxHeight: '500px' }} // Adjust this value based on your requirements
      />
    </div>
  </motion.div>
);

// Comp5
const Comp5 = () => (
  <motion.div
    className="relative w-full max-w-4xl bg-white h-auto bg-opacity-90 shadow-xl rounded-xl flex flex-col lg:flex-row justify-between items-center p-6 lg:p-10 mb-20"
    style={{
      backgroundImage: `url('${tabBg}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}
    variants={animationVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="absolute inset-0 bg-texture bg-no-repeat bg-cover opacity-20"></div>
    <div className="relative z-10 w-full lg:w-1/2 text-left p-6">
      <motion.h1
        className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 flex items-center"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="mr-3">
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        Seamless User Experience
      </motion.h1>
      <p className="text-base lg:text-lg text-gray-700 mb-4">
        Intuitive, easy-to-use interface with guided match suggestions for a smooth journey.
      </p>
      <ul className="list-disc list-inside text-gray-700">
        <li>User-friendly design</li>
        <li>Quick, guided match suggestions</li>
      </ul>
    </div>
    <div className="relative lg:w-1/2 flex justify-center lg:justify-evenly">
      <img
        src={Seamless}
        alt="Seamless User Experience"
        className="w-3/4 h-auto max-w-xs lg:max-w-lg rounded-lg shadow-lg z-20 overflow-hidden"
        style={{ maxHeight: '500px' }} // Adjust this value based on your requirements
      />
    </div>
  </motion.div>
);


const SiteFeatures = [
  { id: 1, Component: Comp1 },
  { id: 2, Component: Comp2 },
  { id: 3, Component: Comp3 },
  { id: 4, Component: Comp4 },
  { id: 5, Component: Comp5 }
];

export default SiteFeatures;
