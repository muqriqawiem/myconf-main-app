import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const InvitationApiSlice = createApi({
  reducerPath: 'InvitationApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    sendInvitation: builder.mutation({
      query: (invitationData) => ({
        url: '/send-invitation',
        method: 'POST',
        body: invitationData,
      }),
    }),
  }),
});

export const { useSendInvitationMutation } = InvitationApiSlice;
