// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Notes from './components/Notes';
import './App.css'; // Ensure the CSS file is imported

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/notes" element={<Notes />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
