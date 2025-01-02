import { IConference } from '@/model/Conference';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface SubmittedPaper {
  paperAuthor: [];
  correspondingAuthor: [];
  paperTitle: string;
  paperFile: string;
  paperKeywords: string[];
  paperAbstract: string;
  paperSubmissionDate: Date;
  conference: { conferenceAcronym: string };
  paperStatus: 'submitted' | 'accepted' | 'rejected' | 'review';
  paperID: string;
}

export const PaperApiSlice = createApi({
  reducerPath: 'paperapi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['paper'],
  endpoints: (builder) => ({
    getSubmittedPapers: builder.query<SubmittedPaper[], void>({
      query: () => `/get-submitted-papers`,
      transformResponse: (response: ApiResponse<{ submittedPapers: SubmittedPaper[] }>) => {
        if (response.success) {
          return response.data.submittedPapers;
        } else {
          throw new Error(response.message);
        }
      },
    }),
    getConferencePapers: builder.query<{
      paperSubmittedInConference: SubmittedPaper[],
      getConferenceDetails: IConference
    }, string>({
      query: (confName) => `/get-conference-papers?confName=${confName}`,
      transformResponse: (response: ApiResponse<{
        paperSubmittedInConference: SubmittedPaper[],
        getConferenceDetails: IConference
      }>) => {
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['paper'],
    }),
    deleteConferencePaper: builder.mutation<ApiResponse<null>, {paperIdList: string[]} >({
      query: ({paperIdList}) => ({
        url: `/delete-papers`,
        method: 'DELETE',
        body: { paperIdList }
      }),
      invalidatesTags: ['paper'],
      transformResponse: (response: ApiResponse<null>) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response;
      }
    }),
    // Add the new endpoint here
    getPapersForConferenceChair: builder.query<SubmittedPaper[], void>({
      query: () => `/papers-for-conference-chair`, // Adjust the endpoint as needed (API had been deleted)
      transformResponse: (response: ApiResponse<{ papers: SubmittedPaper[] }>) => {
        if (response.success) {
          return response.data.papers;
        } else {
          throw new Error(response.message);
        }
      },
      providesTags: ['paper'],
    }),
  }),
});

export const { 
  useGetSubmittedPapersQuery,
  useGetConferencePapersQuery,
  useDeleteConferencePaperMutation,
  useGetPapersForConferenceChairQuery, // Export the new hook
} = PaperApiSlice;