import React from 'react';
import { Link } from 'react-router';

const PaymentCancel = () => {
    return (
        <div>
            <h1>Payment Cancelled</h1>
            <p>Your payment was cancelled. If you have any questions, please contact our support team.</p>
            <Link to="/dashboard/parcels" className="text-blue-600 hover:underline">
                ← Back to Parcels
            </Link>
        </div>
    );
};

export default PaymentCancel;