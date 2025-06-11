import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

const Login = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup && formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        const apiUrl = isSignup
            ? 'http://localhost:5000/api/auth/signup'
            : 'http://localhost:5000/api/auth/login';

        const payload = isSignup
            ? {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            }
            : {
                email: formData.email,
                password: formData.password,
            };

        setLoading(true);

        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong');

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.user.name);

                // 🔔 Dispatch custom event to update Navbar
                window.dispatchEvent(new Event('storageUpdate'));

                toast.success(data.message || (isSignup ? 'Signup successful 🎉' : 'Login successful 🎉'));
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <ToastContainer position="top-center" />
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

                {isSignup && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                {isSignup && (
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
                </button>

                <p className="toggle-text" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup
                        ? 'Already have an account? Login'
                        : "Don't have an account? Sign up"}
                </p>
            </form>
        </div>
    );
};

export default Login;
