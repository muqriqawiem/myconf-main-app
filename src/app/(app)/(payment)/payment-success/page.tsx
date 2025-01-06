import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        {/* Heading with an icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-600 mb-4">
          Thank you for your payment. A receipt has been sent to your registered email address.
        </p>

        {/* Additional message */}
        <p className="text-sm text-gray-500 mb-6">
          Didn&apos;t receive the email?{' '}
          <a
            href="mailto:support@myconf.com"
            className="text-blue-500 hover:underline"
          >
            Contact support
          </a>
          .
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="px-6 py-2">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/payment-history">
            <Button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white">
              View Payment History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;