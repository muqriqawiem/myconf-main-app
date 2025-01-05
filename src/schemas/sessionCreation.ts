import * as z from 'zod';

export const sessionSchema = z.object({
  title: z.string().nonempty('Title is required').max(100),
  description: z.string().max(500).optional(),
  date: z.string().nonempty('Date is required'),
  startTime: z.string().nonempty('Start time is required'),
  endTime: z.string().nonempty('End time is required'),
  conferenceTitle: z.string().nonempty('Conference title is required'),
});
