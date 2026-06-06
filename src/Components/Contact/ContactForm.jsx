import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: '',
        details: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/contact', formData);

            if (res.data.success) {
                toast.success('Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    topic: '',
                    details: ''
                });
            }
        } catch (error) {
            toast.error('Failed to send message!');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="text"
                    name="topic"
                    placeholder="Topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <textarea
                    name="details"
                    placeholder="Details"
                    value={formData.details}
                    onChange={handleChange}
                    className="w-full border p-3 rounded h-32"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default  ContactForm;