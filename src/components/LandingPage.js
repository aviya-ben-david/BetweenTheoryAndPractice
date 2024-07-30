import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/signin');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleNotesClick = () => {
        navigate('/notes');
    };

    return (
        <div>
            <h1>Welcome!</h1>
            <button onClick={handleSignInClick}>Sign In</button>
            <button onClick={handleSignUpClick}>Sign Up</button>
            <button onClick={handleNotesClick}>Notes</button>
        </div>
    );
};

export default LandingPage;
