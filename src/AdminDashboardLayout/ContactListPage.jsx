import React, { useEffect, useState } from 'react';

const ContactListPage = () => {

    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
        const res = await fetch("http://localhost:5000/contacts");
        const data = await res.json();
        setMessages(data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);


    return (
        <div className="py-2">
            <h2 className="text-2xl font-bold mb-5">
                Contact Messages
            </h2>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            messages.map(message => (
                                <tr key={message._id}>
                                <td>{message.name}</td>
                                <td>{message.email}</td>
                                <td>{message.subject}</td>
                                <td>{message.message}</td>

                                <td>
                                    <span
                                    className={
                                        message.status === "unread"
                                        ? "badge badge-error"
                                        : "badge badge-success"
                                    }
                                    >
                                    {message.status}
                                    </span>
                                </td>

                                <td>
                                    {new Date(message.createdAt).toLocaleDateString()}
                                </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactListPage;