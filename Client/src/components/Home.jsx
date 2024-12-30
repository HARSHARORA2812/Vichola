import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Loading from '../utilities/loading.tsx';
import image6 from './Assets/Images/shield.svg';
import image7 from './Assets/Images/tala.svg';
import image8 from './Assets/Images/verified-profile.svg';
import image10 from './Assets/Images/icons8-cross-24.png'
import image11 from './Assets/Images/tick-paid.svg'
import image12 from './Assets/Images/couple1.jpg'
import image13 from './Assets/Images/couple2.jpg'
import image14 from './Assets/Images/couple3.jpg'
import image15 from './Assets/Images/couple4.jpg'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import myVideo from './Vedio.mp4';
import image16 from './Assets/Images/play store icon.svg';
import image17 from './Assets/Images/app store icon.svg';
import image18 from './Assets/Images/app download.png';


const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const testimonials = [
    {
      id: 1,
      image: image12,
      title: "Bharat & Pranjal",
      content: "Happy is the man who finds a true friend, and far happier is he who finds that true friend in his wife. I've found mine through Bichola.in and I'm really thankful to them."
    },
    {
      id: 2,
      image: image13,
      title: "Rohan & Tanu",
      content: "We were looking for a suitable match for a long time and then came to know about Bichola. We had a few criteria in mind which the bureau was not able to deliver due to less pool size. We registered on Bichola.in and hence, found our perfect match in each other."
    },
    {
      id: 3,
      image:image14,
      title: "Ansh & Ayushi",
      content: "I found my soulmate through Bichola.in and we have recently celebrated our anniversary. Both families are also happy and share a special bond. Thanks Bichola.in"
    },
    {
      id: 4,
      image: image15,
      title: "Garvit & Mansi",
      content: "I was searching for my better half for more than 2 years but after getting connected to Mansi on Bichola.in, I felt a special bond with her and decided to marry her. It's been 3 years, and I couldn't be happier. Thanks Bichola.in"
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  const styles = {
    container: {
      position: 'relative',
      height: '100vh', 
      overflow: 'hidden',
    },
    video: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', 
      minWidth: '100%',
      minHeight: '100%',
      zIndex: -1, 
    },
    content: {
      position: 'relative',
      zIndex: 1,
      color: 'white',
      textAlign: 'center',
      paddingTop: '20vh',
    },
  };

  return (
    <div className="min-h-screen border-wrapper">

      <motion.div
        className="min-h-screen bg-cover bg-center relative z-0"
        style={{
          backgroundAttachment: 'fixed', 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
      <video style={styles.video} autoPlay loop muted>
        <source src={myVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

        <div className="absolute w-full inset-0 z-10 bg-gray bg-opacity-70"></div>

        <motion.div
          className="min-h-screen flex flex-col items-center justify-center text-center text-white relative z-10 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text shadow-lg">
            Welcome to Bichola
          </h1>
          <p className="text-lg md:text-xl mb-4 gradient-text shadow-md">
            Connecting hearts, building futures.
          </p>
          <Link to="/login">
            <button className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-semibold transition duration-300 shadow-lg">
              Get Started
            </button>
          </Link>
        
        </motion.div>
      </motion.div>

      <div className='bg-[#f5eff2]'>

      <motion.div>
      <div className="bg-[#f5eff2] min-h-screen p-10 text-center text-gray-800">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-light">
          Start your search at <span className="font-bold text-custom-pink">Vichola</span>
        </h1>
        <hr className="w-1/3 mx-auto mt-2 border-t-2 bg-custom-purple " />
      </header>

      {/* Input Fields */}
      <div className="flex justify-center space-x-8 mb-8  ">
        <input
          type="text"
          placeholder="Name"
          className="border-b-2  bg-[#f5eff2] border-gray-400 outline-none focus:border-custom-pink py-2 text-lg"
        />
        <input
          type="number"
          placeholder="Age"
          className="border-b-2  bg-[#f5eff2] border-gray-400 outline-none focus:border-custom-pink py-2 text-lg"
        />
        <input
          type="email"
          placeholder="Email"
          className="border-b-2  bg-[#f5eff2] border-gray-400 outline-none focus:border-custom-pink py-2 text-lg"
        />
        <input
          type="text"
          placeholder="Preference"
          className="border-b-2  bg-[#f5eff2] border-gray-400 outline-none focus:border-custom-pink py-2 text-lg"
        />
      </div>


      <button className="bg-custom-pink  text-white font-medium py-3 px-8 rounded shadow-lg transition duration-200">
        Let’s Begin
      </button>


      <section className="mt-16">
        <h2 className="text-xl font-semibold text-blue-900 ">
          More than 25 years of
          </h2>
          <br />
          <h1 className='text-blue-900 text-2xl font-semibold'>
          Bringing People Together
          </h1>
     

        <div className="flex justify-center space-x-10 mt-8">

          <div className="text-center">
            <img src={image8} alt="Screened Profiles" className="mx-auto mb-4 w-16 h-16" />
            <h3 className="text-lg font-semibold">100% Screened Profiles</h3>
            <p className="text-gray-600 mt-2">
              Search by location, community, profession & more from lakhs of active profiles
            </p>
          </div>

          <div className="text-center">
            <img src={image7} alt="Verification" className="mx-auto mb-4 w-16 h-16" />
            <h3 className="text-lg font-semibold">Verifications by Personal Visit</h3>
            <p className="text-gray-600 mt-2">
              Special listing for profiles verified by our agents through personal visits
            </p>
          </div>

          <div className="text-center">
            <img src={image6} alt="Privacy Control" className="mx-auto mb-4 w-16 h-16" />
            <h3 className="text-lg font-semibold">Control Over Privacy</h3>
            <p className="text-gray-600 mt-2">
              Restrict unwanted access to contact details & photos/videos
            </p>
          </div>
        </div>
      </section>
    </div>
      </motion.div>


      <motion.div className='bg-[#f5eff2]'>

          <div className="bg-[#f5eff2] min-h-screen p-10">
      {/* Header */}
      <h1 className="text-6xl font-bold text-center text-custom-blue">Membership Plans</h1>
      <p className="text-center mt-8 mx-auto text-custom-blue max-w-3xl">
        Upgrade your plan as per your customized requirements. With a paid membership, you can seamlessly connect with your prospects and get more responses. Here are some key benefits
      </p>

      {/* Membership Plans Section */}
      <div className="flex justify-center mt-16">
        {/* Free Plan */}
        <div className="bg-[#BE95C4] w-1/3 h-[500px] mt-10 rounded-tl-[30px] rounded-bl-[30px] p-6 text-white">
          <h2 className="text-3xl font-semibold text-center border-b-2 border-[#231942] pb-4">Free</h2>
          <ul className="mt-8 space-y-4 ">
            <li className="flex items-center">
              <img src={image10} alt="tick" className="inline mr-2" /> Browse Profiles
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Shortlist & Send Interests
            </li>
            <li className="flex items-center">
              <img src={image10} alt="tick" className="inline mr-2" /> Message & Chat with Unlimited Users
            </li>
            <li className="flex items-center">
              <img src={image10} alt="cross" className="inline mr-2" /> Get up to 3x more daily matches
            </li>
            <li className="flex items-center">
              <img src={image10} alt="cross" className="inline mr-2" /> Unlock access to advanced search
            </li>
            <li className="flex items-center">
              <img src={image10} alt="cross" className="inline mr-2" /> View contact details
            </li>
            <li className="flex items-center">
              <img src={image11} alt="cross" className="inline mr-2" /> Make unlimited voice and video calls
            </li>
            <li className="flex items-center">
              <img src={image10} alt="cross" className="inline mr-2" /> Get 3 free Spotlights
            </li>
          </ul>
          <div className="flex justify-center mt-6">
            <button className="bg-[#5e548e] hover:bg-[#686091] text-white font-bold py-2 px-6 rounded-lg">Register Free</button>
          </div>
        </div>

        {/* Paid Plan */}
        <div className="bg-[#5E548E] w-1/3 h-[600px] rounded-t-[30px] rounded-b-[30px] p-6  text-white">
          <h2 className="text-3xl font-semibold text-center border-b-2 border-[#E0B1CB] pb-4">Paid</h2>
          <ul className="mt-8 space-y-4 mb-8 ">
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2 " /> Browse Profiles
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Shortlist & Send Interests
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Message & Chat with Unlimited Users
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Get up to 3x more daily matches
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Unlock access to advanced search
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> View contact details
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Make unlimited voice and video calls
            </li>
            <li className="flex items-center">
              <img src={image11} alt="tick" className="inline mr-2" /> Get 3 free Spotlights
            </li>
          </ul>
          <div className="flex justify-center mt-6">
            <button className="bg-[#BE95C4] hover:bg-[#C39BC8] text-white font-bold py-2 px-6 rounded-lg">
              Browse Membership Plans
            </button>
          </div>
        </div>
      </div>
    </div>
         

      </motion.div>


        <motion.div className='bg-[#f5eff2]'>
        <div className="my-20 px-8 bg-[#f5eff2]">
      <h2 className="text-2xl font-semibold text-custom-purple mb-4 ml-8">Lakhs of Happy Customers</h2>
      <h1 className="text-4xl font-bold text-custom-pink mb-10 ml-8">
        Matched By <span className="text-5xl text-custom-blue">Vichola</span>
      </h1>

      <div className="flex flex-wrap justify-center items-center gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="relative bg-white rounded-2xl shadow-lg w-[350px] h-[300px] transition-all duration-500 ease-in-out hover:h-[400px] flex flex-col items-center overflow-hidden"
          >
            <div className="absolute top-5 w-[300px] h-[220px] bg-[#231942] rounded-lg overflow-hidden transition-all duration-500 ease-in-out hover:top-[-100px] hover:scale-75 shadow-lg">
              <img src={testimonial.image} alt={testimonial.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-[252px] transition-all duration-500 ease-in-out hover:top-[130px] text-center px-6">
              <h2 className="text-xl font-bold text-[#403868] mb-4">{testimonial.title}</h2>
              <p className="text-[#342368] text-sm">{testimonial.content}</p>
              <a href="#" className="mt-4 inline-block px-4 py-2 bg-[#BE95C4] text-white rounded-lg font-semibold text-xs tracking-wider hover:bg-[#C39BC8]">
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
        </motion.div>

        <motion.div className='bg-[#f5eff2]'> 
        <div className="flex justify-between h-[63vh] w-[70vw] bg-[#d2b2c4] mx-[15vw] my-[10vh] rounded-2xl shadow-lg transition-all duration-300">
      <div className="left-section flex flex-col justify-center mx-[3vw] my-[3vh] p-[3vh] w-1/2">
        <h3 className="text-4xl font-bold">Stay connected using</h3>
        <h1 className="text-6xl font-bold">
          <span className="text-custom-blue">Vichola</span> app
        </h1>
        <p className="text-xl max-w-[20vw] pt-[3vh]">
          Access quick and simple search, instant updates and a great user
          experience on your phone. Download our app rated best in the matrimony
          segment
        </p>
        <div className="image-section flex gap-[3vw] mt-4">
          <img src={image16} alt="Play Store" className="w-[10vw]" />
          <img src={image17} alt="App Store" className="w-[10vw]" />
        </div>
      </div>

      <div className="right-section w-1/2 relative">
        <img
          src={image18}
          alt="App Download"
          className="relative -right-[2vw] top-[3vh] h-[60vh] w-[28vw]"
        />
      </div>
    </div>
        </motion.div>
      

      



        </div>
    </div>
  );
};

export default HomePage;
