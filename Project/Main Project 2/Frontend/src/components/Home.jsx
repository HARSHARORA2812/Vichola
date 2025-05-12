import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
      if (featuresRef.current) {
        featuresRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 overflow-hidden">
      {/* Hero Section with 3D Parallax */}
      <section className="relative overflow-hidden h-screen flex items-center">
        <div 
          ref={heroRef}
          className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 transform -skew-y-6 transition-transform duration-1000"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center transform transition-all duration-1000 hover:scale-105">
            <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block transform transition-transform duration-500 hover:translate-y-2">Find Your Perfect</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400 transform transition-transform duration-500 hover:translate-y-2">Match Today</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 transform transition-transform duration-500 hover:translate-y-2">
              Join thousands of singles who have found love through our platform. Create your profile, browse matches, and start your journey to finding the one.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              {!isLoggedIn ? (
                <Link
                  to="/signup"
                  className="px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-rose-600 to-rose-400 hover:from-rose-700 hover:to-rose-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl"
                >
                  Get started
                </Link>
              ) : (
                <Link
                  to="/matches"
                  className="px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-rose-600 to-rose-400 hover:from-rose-700 hover:to-rose-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-xl"
                >
                  View Matches
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Why Choose Us
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              We make finding your perfect match simple and enjoyable
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-600 to-rose-400 rounded-xl shadow-lg">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-xl font-semibold text-gray-900 tracking-tight">Smart Matching</h3>
                    <p className="mt-5 text-base text-gray-600">
                      Our advanced algorithm matches you with compatible partners based on your preferences and personality.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-600 to-rose-400 rounded-xl shadow-lg">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-xl font-semibold text-gray-900 tracking-tight">Verified Profiles</h3>
                    <p className="mt-5 text-base text-gray-600">
                      All profiles are verified to ensure authenticity and create a safe environment for meaningful connections.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group">
                <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-600 to-rose-400 rounded-xl shadow-lg">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="mt-8 text-xl font-semibold text-gray-900 tracking-tight">Easy Communication</h3>
                    <p className="mt-5 text-base text-gray-600">
                      Connect with your matches through our secure messaging platform and take your time getting to know each other.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gradient-to-r from-rose-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Real couples who found love through our platform
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Story 1 */}
            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-full ring-4 ring-rose-100"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Sarah"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold text-gray-900">Sarah & Michael</h4>
                      <p className="text-sm text-rose-600">Married 2023</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    "We never thought we'd find each other online, but the matching algorithm was spot on! We've been happily married for a year now."
                  </p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-full ring-4 ring-rose-100"
                        src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="David"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold text-gray-900">David & Emily</h4>
                      <p className="text-sm text-rose-600">Engaged 2023</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    "The platform made it so easy to connect with like-minded people. We're now planning our wedding for next summer!"
                  </p>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-full ring-4 ring-rose-100"
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="James"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold text-gray-900">James & Sophia</h4>
                      <p className="text-sm text-rose-600">Dating 2023</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    "We connected instantly and have been inseparable ever since. The platform's focus on meaningful connections really works!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-rose-600 to-rose-400 relative overflow-hidden mt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-rose-400/20 transform -skew-y-6"></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between relative">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            <span className="block">Ready to find your perfect match?</span>
            <span className="block text-rose-100">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-full shadow">
              <Link
                to={isLoggedIn ? "/matches" : "/signup"}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-rose-600 bg-white hover:bg-rose-50"
              >
                {isLoggedIn ? "View Matches" : "Get started"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;