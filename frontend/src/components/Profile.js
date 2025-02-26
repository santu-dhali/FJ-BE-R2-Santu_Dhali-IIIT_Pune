import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave } from 'react-icons/fa';
import "../design/Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', email: '' });
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get('http://localhost:5000/api/v1/getProfile', config);
                setUser(response.data.data);
            } catch (err) {
                setError('Unable to fetch profile data');
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const payload = {
                username: user.username,
                email: user.email,
                currentPassword: showChangePassword ? currentPassword : undefined,
                newPassword: showChangePassword ? newPassword : undefined,
            };

            const response = await axios.put('http://localhost:5000/api/v1/updateProfile', payload, config);
            setSuccess('Profile updated successfully');
            setUser(response.data.data);
            setCurrentPassword('');
            setNewPassword('');
            setIsEditingUsername(false);
            setIsEditingEmail(false);
            setShowChangePassword(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to update profile');
        }
    };

    return (
        <div className="profile">
            <div className="profile-header">
                <h2>Profile Page</h2>
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="profile-details">
                <div className="profile-field">
                    <label>Username:</label>
                    {isEditingUsername ? (
                        <input
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                        />
                    ) : (
                        <span>{user.username}</span>
                    )}
                    <FaEdit
                        className="edit-icon"
                        onClick={() => setIsEditingUsername(!isEditingUsername)}
                    />
                </div>

                <div className="profile-field">
                    <label>Email:</label>
                    {isEditingEmail ? (
                        <input
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    ) : (
                        <span>{user.email}</span>
                    )}
                    <FaEdit
                        className="edit-icon"
                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                    />
                </div>
                <button
                    className="change-password-button"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                >
                    Change Password
                </button>

                {showChangePassword && (
                    <div className="password-fields">
                        <div className="profile-field">
                            <label>Current Password:</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="profile-field">
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <button className="save-button" onClick={handleSubmit}>
                <FaSave /> Save
            </button>
        </div>
    );
};

export default Profile;