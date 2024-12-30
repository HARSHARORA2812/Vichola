import React, { useState } from 'react';
import myVideo from './Assets/Images/login.mp4';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
 
    const [username, setUsername] = useState();
    const [name, setName] = useState(); 
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [age, setAge] = useState();
    const [gender , setGender] = useState();
    const [occupation, setOccupation] = useState();
    const [education, setEducation] = useState();
    const [location, setLocation] = useState();
    const [height, setHeight] = useState();
    const [religion, setReligion] = useState();
     const navigate = useNavigate();

 
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', {
            username, 
            name, 
            email, 
            password, 
            age, 
            gender, 
            occupation, 
            education, 
            location, 
            height, 
            religion, 
        })
        .then(response => {
            navigate('/')
            console.log('User registered:', response.data);
        })
        .catch(error => {
            console.error('Error during sign up:', error);
        });
    };
    


    return (
        <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
            <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={myVideo} type="video/mp4" />
     
            </video>

            <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
                <h2 className="text-3xl font-bold text-red-600 text-center mb-8 uppercase tracking-wider">
                    Create Your Vichola Profile
                </h2>
                <form onClick={handleSubmit} >
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your Username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="image"

                            placeholder="Enter your image URL"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>


                    <div className="mb-4">
                        <label htmlFor="number" className="block text-sm font-semibold text-gray-700 mb-2">
                            Age
                        </label>
                        <input
                            type="date"
                            id="dob"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-2">
                            Occupation
                        </label>
                        <input
                            type="text"
                            id="occupation"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            placeholder="Enter your occupation"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-2">
                            Education
                        </label>
                        <input
                            type="text"
                            id="education"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            placeholder="Highest education level"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                            Height
                        </label>
                        <input
                            type="text"
                            id="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Height in cm or feet"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="religion" className="block text-sm font-semibold text-gray-700 mb-2">
                            Religion
                        </label>
                        <input
                            type="text"
                            id="religion"
                            value={religion}
                            onChange={(e) => setReligion(e.target.value)}
                            placeholder="Your religion"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"

                        className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition duration-300 mt-6"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;