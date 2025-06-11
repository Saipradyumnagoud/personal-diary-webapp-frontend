import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './main.css';

const Main = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState(new Set());
    const [userName, setUserName] = useState('');
    const [quote, setQuote] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const dailyQuotes = [
            "Believe you can and you're halfway there.",
            "Each day is a blank page in your diary.",
            "Do something today that your future self will thank you for.",
            "Start where you are. Use what you have. Do what you can.",
            "Make each day your masterpiece."
        ];

        const dayIndex = new Date().getDate() % dailyQuotes.length;
        setQuote(dailyQuotes[dayIndex]);

        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        if (name) setUserName(name);

        if (token) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/entries/dates/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const formattedSet = new Set(data.map(date => new Date(date).toISOString().split('T')[0]));
                    setMarkedDates(formattedSet);
                })
                .catch(() => alert('Failed to fetch entry dates'));
        }
    }, []);

    const handleDateClick = (date) => {
        if (date > new Date()) {
            alert('You cannot write for future dates');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in');
            return;
        }

        const formattedDate = date.toISOString().split('T')[0]; // always in yyyy-mm-dd
        navigate(`/entry/${formattedDate}`);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formatted = date.toISOString().split('T')[0];
            if (markedDates.has(formatted)) {
                return 'highlight'; // class to style the tile
            }
        }
        return null;
    };

    const handlePlusClick = () => {
        handleDateClick(selectedDate);
    };

    return (
        <div className="main-container">
            <h2>{userName ? `Hello ${userName}, welcome back to your diary` : `Please log in to use your diary.`}</h2>
            <div className="quote-banner">
                <p className="quote">“{quote}”</p>
            </div>
            <div className="calendar-wrapper">
                <Calendar
                    onChange={(date) => setSelectedDate(date)}
                    onClickDay={handleDateClick}
                    value={selectedDate}
                    tileClassName={tileClassName}
                />
            </div>
            <div className="bottom-container">
                <div className="plus-button" onClick={handlePlusClick}>+</div>
            </div>
        </div>
    );
};

export default Main;
