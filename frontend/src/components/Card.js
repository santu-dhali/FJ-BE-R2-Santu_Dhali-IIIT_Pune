import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import "../design/Dashboard.css";

const Card = ({ data, type, onEdit, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEdit = () => {
        setShowOptions(false);
        onEdit(data);
    };

    const handleDelete = () => {
        setShowOptions(false);
        onDelete(data._id);
    };

    return (
        <div className="card">
            <div className="card-header">
                <span className="date">
                    {new Date(data.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                    })}
                </span>
                <span className="amount">${data.amount}</span>
                <div className="icon" onClick={() => setShowOptions(!showOptions)}>
                    <FaEllipsisV />
                </div>

                {showOptions && (
                    <div className="options" ref={optionsRef}>
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
            <div className="description">{data.description}</div>
            <div className="type">{type === 'income' ? `Source: ${data.source}` : `Category: ${data.category}`}</div>
        </div>
    );
};

export default Card;
