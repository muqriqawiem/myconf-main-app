import Link from 'next/link';

interface Payment {
    _id: string;
    conferenceId?: { conferenceTitle: string }; // Make conferenceId optional
    amount: number;
    paymentType: string;
    status: string;
    createdAt: string;
    invoiceUrl?: string;
}

interface PaymentTableProps {
    payments: Payment[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Conference</th>
                    <th className="py-2 px-4 border-b">Amount</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Invoice</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">
                            {payment.conferenceId?.conferenceTitle || 'Unknown Conference'}
                        </td>
                        <td className="py-2 px-4 border-b">${payment.amount}</td>
                        <td className="py-2 px-4 border-b">{payment.paymentType}</td>
                        <td className="py-2 px-4 border-b">{payment.status}</td>
                        <td className="py-2 px-4 border-b">
                            {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">
                            {payment.invoiceUrl && (
                                <Link
                                    href={payment.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Download
                                </Link>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}