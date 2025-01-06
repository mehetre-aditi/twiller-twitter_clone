import React, { useEffect, useState } from 'react';
import { getLoginHistory } from '../../../services/authService';  // Adjusted import path

const LoginHistory = () => {
    const [history, setHistory] = useState([]);

    // Fetch userId dynamically from localStorage (can be updated to fetch from context or other means)
    const userId = localStorage.getItem('userId');  // Example using localStorage, replace with your dynamic method

    useEffect(() => {
        const fetchHistory = async () => {
            if (userId) {
                try {
                    const data = await getLoginHistory(userId);  // Pass userId to the API call
                    setHistory(data);
                } catch (error) {
                    console.error('Error fetching login history:', error);
                }
            } else {
                console.error('User ID not found. Please login first.');
            }
        };

        fetchHistory();
    }, [userId]);  // Dependency on userId, re-fetch if it changes

    return (
        <div>
            <style>
                {`
                    body {
                        font-family: Arial, sans-serif;
                        color: gray;
                        font-size: 0.9rem;
                    }

                    h2 {
                        color: skyblue;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }

                    th {
                        background-color: #f2f2f2;
                    }

                    tr:hover {
                        background-color: #f1f1f1;
                    }
                `}
            </style>
            <h2>Login History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Device</th>
                        <th>IP Address</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index}>
                            <td>{new Date(entry.timestamp).toLocaleString()}</td>
                            <td>{entry.browser}</td>
                            <td>{entry.os}</td>
                            <td>{entry.device}</td>
                            <td>{entry.ip}</td>
                            <td>{entry.location?.city || 'N/A'}, {entry.location?.country || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LoginHistory;









