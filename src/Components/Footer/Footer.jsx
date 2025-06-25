// Footer.jsx
import React from 'react';
import '../Main/main.css'; // assuming the styles for .plus-button are defined here

const Footer = ({ onPlusClick }) => {
    return (
        <div className="bottom-container">
            <div className="plus-button" onClick={onPlusClick}>+</div>
        </div>
    );
};

export default Footer;
