'use client';

import { useEffect, useState } from 'react';
import PaymentTable from './components/PaymentTable';
import Loader from '@/components/Loader';

export const dynamic = 'force-dynamic'

export default function PaymentHistoryPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setPayments(data.data.payments);
            } catch (error) {
                console.error('Error fetching payments:', error);
                setError('Failed to fetch payments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Payment History</h1>
            <PaymentTable payments={payments} />
        </div>
    );
}