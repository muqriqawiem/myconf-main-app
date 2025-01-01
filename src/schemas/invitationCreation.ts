import { z } from "zod";

export const invitationSchema = z.object({
  recipientEmail: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters long'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});
