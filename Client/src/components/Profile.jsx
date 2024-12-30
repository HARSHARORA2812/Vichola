import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('currentUser'));
        setUserData(storedUserData);
    }, []);

    const handleAuthButtonClick = () => {
        if (userData) {
            localStorage.removeItem('currentUser');
            setUserData(null);
            alert('You have been logged out.');
        } 
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-purple-100 py-10">
            <h1 className="text-5xl font-semibold text-purple-600 mb-8">My Profile</h1>
            <button
                onClick={handleAuthButtonClick}

                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full mb-6"
            >
                
                {userData ? 'Logout' : <Link to="/login" className="text-white">Login/Register</Link>}
            </button>

            <div className="bg-white rounded-lg shadow-lg border border-gray-300 w-full max-w-md p-6">
                {userData ? (
                    <div className="text-center">
                        <img
                            src={userData.image}
                            alt={`${userData.username}'s profile`}
                            className="w-24 h-24 rounded-full mx-auto mb-6 shadow-md"
                        />
                        <h2 className="text-2xl font-semibold mb-4 text-purple-600">{userData.username}</h2>
                        <div className="text-left text-lg text-gray-700">
                            <p className="mb-2"><strong className="text-custom-purple">Full Name:</strong> {userData.name}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Email:</strong> {userData.email}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Age:</strong> {userData.age}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Gender:</strong> {userData.gender || 'Not specified'}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Occupation:</strong> {userData.occupation}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Education:</strong> {userData.education}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Location:</strong> {userData.location}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Height:</strong> {userData.height}</p>
                            <p className="mb-2"><strong className="text-custom-purple">Religion:</strong> {userData.religion}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-lg text-center text-gray-600">Please log in to view your profile.</p>
                )}
            </div>
        </div>
    );
}

export default Profile; 