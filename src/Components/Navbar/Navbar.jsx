import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem('userName'));
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const updateUser = () => {
            const name = localStorage.getItem('userName');
            setUserName(name);
        };

        // ✅ Listen to custom event dispatched from Login.jsx
        window.addEventListener('storageUpdate', updateUser);

        return () => window.removeEventListener('storageUpdate', updateUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setUserName(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="logo-link">My Diary</Link>
            </div>
            <div className="navbar-actions">
                {userName ? (
                    <div
                        className="user-dropdown"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <span className="user-name">{userName}</span>
                        {showDropdown && (
                            <div className="dropdown-menu" onClick={handleLogout}>
                                Logout
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
