import React from 'react';
import { Link } from 'react-router-dom';
import errroImage from '../images/error.png';

const ErrorPage = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full lg:w-10/12 text-center">
            <div className="p-8 bg-white shadow-md rounded-lg">
              <img
                className="w-66 h-52 mx-auto object-contain"
                src={errroImage}
                alt="error"
              />
              <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-800">Ohh! Page Not Found</h1>
              </div>
              <p className="mt-4 text-gray-600">We can’t seem to find the page you’re looking for</p>

              <form className="mt-6 flex justify-center">
                <input
                  type="text"
                  className="form-control mb-2 mr-2 border border-gray-300 p-2 rounded-lg"
                  placeholder="Search"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
                  <span className="flaticon-magnifying-glass"></span>
                </button>
              </form>
              {/* End form */}

              <Link to="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-6 rounded-lg">
                Back To Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
