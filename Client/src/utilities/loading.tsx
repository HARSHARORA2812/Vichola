import React from 'react';
import { useLottie } from 'lottie-react';
import loadingAnimation from '../images/loading.json'; // Adjusted import path for React

const Loading: React.FC = () => {
    const options = {
        animationData: loadingAnimation,
        loop: true
    };

    const { View } = useLottie(options);

    return (
        <div className="loading-container">
            <div className="loading-background"></div>
                <div className="loading-content">
                    {View}
                </div>
        </div>
    );
}

export default Loading;
