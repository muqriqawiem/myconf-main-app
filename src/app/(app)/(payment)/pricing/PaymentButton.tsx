"use client";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { handleCheckoutPayment } from "@/helpers/HandleCheckoutPayement";
import React, { useState } from 'react';

interface PaymentButtonProps {
  isPaid: boolean; // Add isPaid prop
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ isPaid }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Add a loading state

  const CheckoutPayement = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (loading || isPaid) return; // Disable if already paid
    setLoading(true); // Disable the button

    try {
      const response = await handleCheckoutPayment(e);
      console.log(response);

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Payment initiated successfully',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: `${response.error}` || "Failed to process payment.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment error: ', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while processing the payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false); // Re-enable the button
    }
  };

  return (
    <Button
      onClick={(e) => CheckoutPayement(e)}
      variant={isPaid ? "outline" : "outline"} // Use outline variant for both states
      size="sm" // Match the size of other buttons
      className={`px-10 py-4 bg-blue-600 text-white hover:bg-blue-300 ${isPaid ? "bg-green-700 text-white hover:bg-green-600 cursor-not-allowed" : ""}`} // Green background for paid state
      disabled={isPaid || loading} // Disable if already paid or loading
    >
      {isPaid ? "Security Deposit Paid" : loading ? "Processing..." : "Pay Security Deposit $50"}
    </Button>
  );
};

export default PaymentButton;