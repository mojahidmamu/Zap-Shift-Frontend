import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

    // Mark as Read: 
    const handleRead = async (id) => {
        try{
            const res = await fetch(`http://localhost:5000/contacts/${id}/read`, {
                method: "PATCH"
            });

            const data = await res.json();
            if(data.success) {
                toast.success("Message marked as read");
                fetchMessages();
            }
        } 
        catch(error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    }

    // delete message:
    const handleDelete = async (id ) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try{
            const res = await fetch(`http://localhost:5000/contacts/${id}`, {
                method: "DELETE", 
            })

            const data = await res.json();

            if (data.success) {
                toast.success("Message deleted");
                fetchMessages();
                setSelectedMessage(null);
            } 
        }
        catch(error) {
            console.log(error);
            toast.error("Failed to delete message");
        }
    }


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
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            messages.map(message => (
                                <tr key={message._id}>
                                    <td>{message.name}</td>
                                    <td>{message.email}</td>
                                    <td>{message.subject}</td>

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
                                    <td>
                                        <button
                                            onClick={() =>
                                            setSelectedMessage(message)
                                            }
                                            className="btn btn-sm btn-primary"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedMessage && (
            <dialog
            open
            className="modal modal-open"
            >
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-2xl mb-4">
                Contact Details
                </h3>

                <div className="space-y-3">
                    <p>
                        <strong>Name:</strong>{" "}
                        {selectedMessage.name}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {selectedMessage.email}
                    </p>

                    <p>
                        <strong>Subject:</strong>{" "}
                        {selectedMessage.subject}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                        className={
                            selectedMessage.status ===
                            "unread"
                            ? "badge badge-error"
                            : "badge badge-success"
                        }
                        >
                        {selectedMessage.status}
                        </span>
                    </p>

                <div>
                    <strong>Message:</strong>

                    <div className="mt-2 p-4 border rounded-lg bg-base-200">
                    {selectedMessage.message}
                    </div>
                </div>
                </div>

                <div className="modal-action mx-4">
                    {selectedMessage.status ===
                    "unread" ? (
                        <button
                        onClick={() =>
                            handleRead(selectedMessage._id)
                        }
                        className="btn btn-success text-red-500 font-bold"
                        >
                            Mark as Read
                        </button>
                    ) : (
                        <button
                        disabled
                        className="btn btn-success btn-disabled"
                        >
                            Already Read
                        </button>
                    )}

                    <button
                        onClick={() =>
                        handleDelete(selectedMessage._id)
                        }
                        className="btn btn-error font-bold mx-4"
                    >
                        Delete
                    </button>

                    <button
                        onClick={() =>
                        setSelectedMessage(null)
                        }
                        className="btn"
                    >
                        Close
                    </button>
                </div>
            </div>
            </dialog>
        )}
        </div>
    );
};

export default ContactListPage;