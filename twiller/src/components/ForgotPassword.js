import React, { useState } from 'react';

const ForgotPassword = ({ onBackToLogin }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone }),
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f8fa',
            fontFamily: 'Arial, sans-serif',
            color: '#14171a',
        }}>
            <h2 style={{
                fontSize: '24px',
                marginBottom: '20px',
                color: '#1da1f2',
            }}>Forgot Password</h2>
            <form 
                onSubmit={handleSubmit} 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px',
                    padding: '20px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                }}
            >
                <input
                    type="text"
                    placeholder="Enter your Email or Phone Number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        border: '1px solid #e1e8ed',
                        borderRadius: '5px',
                        fontSize: '16px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1da1f2',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0d8ce0'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#1da1f2'}
                >
                    Reset Password
                </button>
            </form>
            {message && <p style={{
                marginTop: '15px',
                color: message.includes('error') ? 'red' : 'green',
                fontSize: '14px',
            }}>{message}</p>}
            <button
                onClick={onBackToLogin}
                style={{
                    marginTop: '20px',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    color: '#1da1f2',
                    border: '1px solid #1da1f2',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
                onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1da1f2';
                    e.target.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#1da1f2';
                }}
            >
                Back to Login
            </button>
        </div>
    );
};

export default ForgotPassword;



