import { useEffect, useState } from 'react';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/all-payments')
            .then(res => res.json())
            .then(data => setPayments(data));
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5">📊 All Payments (Admin)</h1>

            <table className="table w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th>#</th>
                        <th>User</th>
                        <th>Parcel</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {payments.map((p, i) => (
                        <tr key={p._id}>
                            <td>{i + 1}</td>
                            <td>{p.userEmail}</td>
                            <td>{p.parcelName}</td>
                            <td>${p.cost}</td>
                            <td>
                                {new Date(p.paid_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPayments;