import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'https://backend-yourname.vercel.app'; // 🔁 replace with your backend URL

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
      let payload = isSignup
        ? { username, email, password }
        : { email, password };

      // Validate emails and passwords
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

      if (!res.ok) {
        throw new Error(data.message || data.errors || 'Something went wrong');
      }

      if (!isSignup && data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
      } else if (isSignup) {
        alert(data.message || 'Signed up successfully');
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
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
          * By signing up, you agree to our{' '}
          <a href="#">Terms of Use</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
