"use client"
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { handleCheckoutPayment } from "@/helpers/HandleCheckoutPayement"
import React, { useState } from 'react'

const PaymentButton = () => {

  const { toast } = useToast();
  const [loading, setLoading] = useState(false); //add a loading state

  const CheckoutPayement = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); //prevent default form submission behaviour
    if (loading) return;
    setLoading(true); //disable the button

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
        description: 'An unexpected error occured while processing the payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false); //re-enable button
    }
  };

  return (
    <Button onClick={(e) => CheckoutPayement(e)} variant="default" size="lg" className="px-10 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700" disabled={loading}>
      {loading ? 'Processing...' : 'Pay $50'}
    </Button>
  );
};

export default PaymentButton;
