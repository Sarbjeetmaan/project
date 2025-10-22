import React, { useState } from 'react';
import './CSS/LoginSignup.css';

import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = 'https://backend-91e3.onrender.com'; // backend URL

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, email, confirmEmail, password, confirmPassword } = formData;

    try {
      let endpoint = isSignup ? '/signup' : '/login';
      let payload = isSignup ? { username, email, password } : { email, password };

      if (isSignup) {
        if (email !== confirmEmail) throw new Error('Emails do not match');
        if (password !== confirmPassword) throw new Error('Passwords do not match');
      }

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (!isSignup && data.token) {
        // Save token and role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Role-based redirect
       if (data.role === 'admin') {
        // Pass token + role in the URL
         window.location.href = `https://admin-68ww.vercel.app?token=${data.token}&role=${data.role}`;
          } else {
             navigate('/');
          }

      }

      alert(isSignup ? data.message || 'Signed up successfully' : 'Login successful');
    } catch (err) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="auth-left animate-fade">
        <h1>Eloc</h1>
        <p>
          Your one-stop e-commerce store for all electronic gadgets and accessories. Discover
          the latest products at the best prices!
        </p>
        <p className="auth-slogan">Smart. Fast. Reliable.</p>
      </div>

      {/* Right Panel */}
      <div className="auth-right animate-slide">
        <div className="auth-box">
          <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Log In' : 'Sign Up'}
            </span>
          </p>

          {error && <p className="auth-error">{error}</p>}
          {loading && <p className="auth-loading">Please wait...</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
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

            {isSignup && (
              <input
                type="email"
                name="confirmEmail"
                placeholder="Confirm Email"
                value={formData.confirmEmail}
                onChange={handleChange}
                required
              />
            )}

           {/* Password Field with Show/Hide */}
<div className="password-field">
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <span
    className="toggle-password"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

{/* Confirm Password Field with Show/Hide */}
{isSignup && (
  <div className="password-field">
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      name="confirmPassword"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
    <span
      className="toggle-password"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
)}


            <button type="submit" disabled={loading}>
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <div className="divider">or</div>

          <div className="social-buttons">
            <button className="google">
              <FaGoogle /> Continue with Google
            </button>
            <button className="facebook">
              <FaFacebookF /> Continue with Facebook
            </button>
          </div>

          <p className="auth-footer">
            * By signing up, you agree to our <a href="#">Terms of Use</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
