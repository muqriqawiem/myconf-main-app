'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { sessionSchema } from '@/schemas/sessionCreation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function EditSessionClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('id'); // Extract session ID from URL
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof sessionSchema>>({
        resolver: zodResolver(sessionSchema),
    });

    const { toast } = useToast();

    useEffect(() => {
        async function fetchSessionDetails() {
            const response = await fetch(`/api/get-session/${sessionId}`);
            const data = await response.json();
            if (data.success) {
                form.reset(data.session); // Prefill the form with session data
            } else {
                throw new Error(data.error);
            }
        }
    
        if (sessionId) {
            fetchSessionDetails();
        }
    }, [sessionId]);    

    const onSubmit = async (data: z.infer<typeof sessionSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/update-session/${sessionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                toast({
                    title: 'Success',
                    description: 'Session updated successfully!',
                });
                router.push('/dashboard'); // Redirect to dashboard
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'An error occurred while updating the session.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-3">
            <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Edit Session
                    </h1>
                    <p className="mb-4">Update the details of your session</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Session Title</FormLabel>
                                    <Input {...field} placeholder="Enter the session title" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <Input {...field} placeholder="Enter a brief description" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="date"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <Input type="date" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="startTime"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <Input type="time" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="endTime"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <Input type="time" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="conferenceTitle"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Conference Title</FormLabel>
                                    <Input {...field} placeholder="Enter the associated conference title" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="w-full" type="submit">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                </>
                            ) : (
                                'Update Session'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}