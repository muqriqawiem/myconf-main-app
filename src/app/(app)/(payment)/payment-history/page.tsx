'use client';

import { useEffect, useState } from 'react';
import PaymentTable from './components/PaymentTable';

export default function PaymentHistoryPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('/api/get-payments', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch payments');
                }

                const data = await response.json();
                console.log('Payments:', data.data.payments); // Log the payments array
                setPayments(data.data.payments);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Payment History</h1>
            <PaymentTable payments={payments} />
        </div>
    );
}