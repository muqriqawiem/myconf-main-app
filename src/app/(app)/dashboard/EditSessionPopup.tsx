"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useParams, useRouter } from 'next/navigation';
import * as z from "zod";
import { sessionSchema } from "@/schemas/sessionCreation";
import { useUpdateSessionMutation } from "@/store/features/SessionApiSlice";
import { Loader2 } from "lucide-react";

interface EditSessionPopupProps {
  sessionDetails: z.infer<typeof sessionSchema>;
}

const EditSessionPopup = ({ sessionDetails }: EditSessionPopupProps) => {
    const params = useParams<{ sessionId: string }>();
  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: sessionDetails,
  });

  const [updateSession] = useUpdateSessionMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof sessionSchema>) => {
    setIsLoading(true);
    try {
      const response = await updateSession({ sessionId:params.sessionId, sessionDetails: data }).unwrap();
      toast({ title: "Success", description: response.message });
    } catch (error: any) {
      toast({ title: "Error", description: error.data?.message || "Failed to update session.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Session</Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-scroll w-full">
        <SheetHeader>
          <SheetTitle>Edit Session Details</SheetTitle>
          <SheetDescription>Update the details of your session below.</SheetDescription>
        </SheetHeader>
        <div className="p-6 max-w-lg mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Input {...field} />
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
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Update Session"}
              </Button>
            </form>
          </Form>
        </div>
        <SheetFooter>
          <SheetClose>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditSessionPopup;
