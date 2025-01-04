import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';
import { sessionSchema } from '@/schemas/sessionCreation';

// Interfaces for organized sessions and API response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface OrganizedSession {
  _id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  conferenceTitle: string;
  createdAt: Date;
}

interface UpdateSessionType {
  sessionId: string;
  sessionDetails: z.infer<typeof sessionSchema>;
}

export const SessionApiSlice = createApi({
  reducerPath: 'sessionapi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['session'],
  endpoints: (builder) => ({
    // Fetch all organized sessions
    getOrganizedSessions: builder.query<OrganizedSession[], void>({
      query: () => `/get-organized-sessions`,
      transformResponse: (response: ApiResponse<{ sessions: OrganizedSession[] }>) => {
        if (response.success) {
          return response.data.sessions;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['session'],
    }),

    // Create a new session
    createNewSession: builder.mutation<ApiResponse<null>, z.infer<typeof sessionSchema>>({
      query: (newSession) => ({
        url: '/create-session',
        method: 'POST',
        body: newSession,
      }),
      invalidatesTags: ['session'],
    }),

    // Update an existing session
    updateSession: builder.mutation<ApiResponse<null>, UpdateSessionType>({
      query: ({ sessionId, sessionDetails }) => ({
        url: `/update-session/${sessionId}`,
        method: 'PUT',
        body: sessionDetails,
      }),
      invalidatesTags: ['session'],
    }),

    // Fetch a session by its ID
    getSessionById: builder.query<OrganizedSession, string>({
      query: (sessionId) => `/get-session/${sessionId}`,
      transformResponse: (response: ApiResponse<OrganizedSession>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetOrganizedSessionsQuery,
  useCreateNewSessionMutation,
  useUpdateSessionMutation,
  useGetSessionByIdQuery,
} = SessionApiSlice;
