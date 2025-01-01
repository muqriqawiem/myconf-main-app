'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { invitationSchema } from '@/schemas/invitationCreation';
import { useSendInvitationMutation } from '@/store/features/InvitationApiSlice';

export default function SendInvitationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendInvitation] = useSendInvitationMutation();

  const form = useForm<z.infer<typeof invitationSchema>>({
    resolver: zodResolver(invitationSchema),
  });

  const onSubmit = async (data: z.infer<typeof invitationSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await sendInvitation(data).unwrap();
      toast({
        title: 'Success',
        description: 'Invitation sent successfully!',
      });
      router.push('/dashboard/invitations');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to send the invitation.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-3">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Send Invitation</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Recipient Email */}
            <FormField
              name="recipientEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <Input {...field} placeholder="Enter recipient's email" />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Subject */}
            <FormField
              name="subject"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Input {...field} placeholder="Enter the subject of the invitation" />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Message */}
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <Textarea {...field} placeholder="Write your invitation message here" />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
