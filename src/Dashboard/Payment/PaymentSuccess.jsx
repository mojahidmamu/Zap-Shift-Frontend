import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const PaymentSuccess = () => {

    const [params] = useSearchParams();
    const parcelId = params.get('parcelId');

    useEffect(() => {
        if (!parcelId) return;

        fetch(`http://localhost:5000/payment-success/${parcelId}`, {
            method: 'PATCH',
        }).then(() => {
            console.log('Payment updated');
        });
    }, [parcelId]);

    return (
        <div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment. Your transaction has been completed.</p>
        </div>
    );
};

export default PaymentSuccess;