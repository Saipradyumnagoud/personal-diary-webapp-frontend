import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FiUpload } from 'react-icons/fi';
import './entry.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const moods = ['😊', '😢', '😠', '😴', '😇'];

// ⬅️ Move FileUpload OUTSIDE Entry component
const FileUpload = ({ handleImageChange }) => (
    <div className="upload-wrapper">
        <label htmlFor="file-upload" className="upload-icon">
            <FiUpload size={24} />
            Upload Images
        </label>
        <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
        />
    </div>
);

const Entry = () => {
    const { date } = useParams();
    const [entries, setEntries] = useState([]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [mood, setMood] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const formattedDate = new Date(date + 'T00:00:00').toDateString();
    const currentTime = new Date().toLocaleTimeString();

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/entries/${date}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setEntries(data.entries || []))
            .catch(() => alert('Failed to fetch entry'));
    }, [date]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreview(files.map(file => URL.createObjectURL(file)));
    };

    const addEmoji = (emoji) => {
        setText(prev => prev + emoji.native);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', date);
        formData.append('title', title);
        formData.append('text', text);
        formData.append('tags', tags);
        formData.append('mood', mood);
        images.forEach((img) => formData.append('images', img));

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/entries', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setEntries(prev => [...prev, data.newEntry]);
            setTitle('');
            setText('');
            setTags('');
            setMood('');
            setImages([]);
            setPreview([]);
            toast.success("Entry saved successfully!");
        } else {
            toast.error("Failed to save entry");
        }
    };


    const handleDelete = async (entryId) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/entries/${entryId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setEntries(entries.filter(entry => entry._id !== entryId));
        } else {
            alert('Failed to delete entry');
        }
    };

    return (
        <div className="entry-container">
            <h2 className="entry-heading">Diary Entry for {formattedDate}</h2>
            <p className="time-label">🕒 {currentTime}</p>

            <div className="past-entries">
                <h3>Past Entries</h3>
                {entries.length > 0 ? entries.map((entry, i) => (
                    <div className="entry-card" key={i}>
                        <h4>{entry.title}</h4>
                        <p>{entry.text}</p>
                        {entry.tags && <p><strong>Tags:</strong> {entry.tags.join(', ')}</p>}
                        {entry.mood && <p><strong>Mood:</strong> {entry.mood}</p>}
                        {entry.images && entry.images.map((img, idx) => (
                            <img key={idx} src={`http://localhost:5000${img}`} alt="Uploaded" className="entry-image" />
                        ))}
                        <div className="entry-actions">
                            <button disabled>Edit</button>
                            <button onClick={() => handleDelete(entry._id)}>Delete</button>
                        </div>
                    </div>
                )) : <p>No entries for this date yet.</p>}
            </div>

            <form className="entry-form" onSubmit={handleSubmit}>
                <h3>Add New Entry</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Write more here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                ></textarea>

                <button
                    type="button"
                    className="emoji-toggle"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >😀 Emoji</button>

                {showEmojiPicker && (
                    <Picker data={data} onEmojiSelect={addEmoji} />
                )}

                <input
                    type="text"
                    placeholder="Add tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <div className="mood-selector">
                    <label>Select Mood:</label>
                    <div className="mood-options">
                        {moods.map((m, i) => (
                            <button
                                type="button"
                                key={i}
                                className={`mood-button ${m === mood ? 'selected' : ''}`}
                                onClick={() => setMood(m)}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <FileUpload handleImageChange={handleImageChange} />

                <div className="preview-images">
                    {preview.map((src, i) => (
                        <img key={i} src={src} alt="Preview" />
                    ))}
                </div>

                <button type="submit">Save Entry</button>
            </form>
            <ToastContainer position="top-center" autoClose={3000} />

        </div>
    );
};

export default Entry;
