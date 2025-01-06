import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const PaymentCancel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        {/* Heading with an icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Canceled
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-600 mb-4">
          Your payment was not completed. You can try again or contact us if you need assistance.
        </p>

        {/* Support message */}
        <p className="text-sm text-gray-500 mb-6">
          Need help? Email us at{' '}
          <a
            href="mailto:support@myconf.com"
            className="text-blue-500 hover:underline"
          >
            support@myconf.com
          </a>
          .
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="px-6 py-2">
              Go Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
