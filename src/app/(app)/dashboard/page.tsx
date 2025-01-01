"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetOrganizedConferencesQuery } from '@/store/features/ConferenceApiSlice';
import Loader from '@/components/Loader';
import EditPopup from './EditPopup';
import { useGetSubmittedPapersQuery } from '@/store/features/PaperApiSlice';
import EditConferencePopup from "./EditConferencePopup";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { PulseLoader } from "react-spinners";
import { useParams } from 'next/navigation';

const OrganizedConferenceComponent = () => {
  const { data: organizedConferences, error: conferencesError, isLoading: loadingConferences } = useGetOrganizedConferencesQuery();
  const params = useParams();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  return (
    <div className='flex justify-center'>
      <Card className='w-full md:w-3/4 '>
        <CardHeader>
          <CardTitle>Organized Conferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conference</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingConferences ? (
                <TableRow className="w-full justify-center items-center text-center ">
                  <TableCell colSpan={4}><span className="">Loading <PulseLoader className="inline-block" size={6} /></span></TableCell>
                </TableRow>
              ) : organizedConferences && organizedConferences.length > 0 ? (
                organizedConferences.map((organizedConference: any) => {
                  const profileUrl = `${baseUrl}/submit-paper/${organizedConference.conferenceAcronym}`; // Profile URL
                  const invitationUrl = `${baseUrl}/send-invitation/`; // Invitation URL

                  return (
                    <TableRow key={organizedConference._id}>
                      <TableCell className="font-medium">{organizedConference.conferenceAcronym}</TableCell>
                      <TableCell>{organizedConference.conferenceOrganizerRole}</TableCell>
                      <TableCell>{moment(organizedConference.conferenceCreatedAt).calendar()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/${organizedConference.conferenceAcronym}`}>
                            <Button variant={'outline'}>View Papers</Button>
                          </Link>
                          <Link href={invitationUrl} target="_blank">
                            <Button variant={'outline'}>Send Invitation</Button>
                          </Link>
                          <EditConferencePopup conferenceDetails={organizedConference} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No organized conferences found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const SubmittedPaperComponent = () => {
  const { data: submittedPapers, error: SubmittedPaperError, isLoading: loadingPapers } = useGetSubmittedPapersQuery();

  return (
    <div className='flex justify-center items-start'>
      <Card className='w-full md:w-3/4'>
        <CardHeader>
          <CardTitle>Submitted Papers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paper Title</TableHead>
                <TableHead>Conference</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingPapers ? (
                <TableRow className="w-full justify-center items-center text-center ">
                  <TableCell colSpan={5}><span className="">Loading <PulseLoader className="inline-block" size={6} /></span></TableCell>
                </TableRow>
              ) : submittedPapers && submittedPapers.length > 0 ? (
                submittedPapers.map((submittedPaper) => (
                  <TableRow key={submittedPaper.paperTitle}>
                    <TableCell className="font-medium">{submittedPaper.paperTitle}</TableCell>
                    <TableCell className="font-medium">{submittedPaper.conference.conferenceAcronym}</TableCell>
                    <TableCell>{moment(submittedPaper.paperSubmissionDate).calendar()}</TableCell>
                    <TableCell>
                      {(() => {
                        switch (submittedPaper.paperStatus) {
                          case "submitted":
                            return <Badge variant="submitted">Submitted</Badge>;
                          case "accepted":
                            return <Badge variant="accepted">Accepted</Badge>;
                          case "rejected":
                            return <Badge variant="rejected">Rejected</Badge>;
                          case "review":
                            return <Badge variant="review">Review</Badge>;
                          default:
                            return <Badge variant="submitted">Submitted</Badge>;
                        }
                      })()}
                    </TableCell>
                    <TableCell><EditPopup {...submittedPaper} /></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No submitted papers found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const Page: React.FC = () => {
  const [showConferences, setShowConferences] = useState(true);
  const [role, setRole] = useState('Conference Chair');

  const handleToggle = () => {
    setShowConferences((prev) => !prev);
    setRole((prev) => (prev === 'Author' ? 'Conference Chair' : 'Author'));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-lg font-medium text-gray-600">
            Current View: <span className="text-blue-600">{role}</span>
          </p>
          <Toggle
            aria-label="Toggle between organized conferences and submitted papers"
            onClick={handleToggle}
            className={`flex items-center px-4 py-2 bg-gray-200 rounded-lg cursor-pointer transition-colors duration-300
                  ${showConferences ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            {showConferences ? (
              <span className="font-medium text-sm transition-opacity duration-300">View as Author</span>
            ) : (
              <span className="font-medium text-sm transition-opacity duration-300">View as Conference Chair</span>
            )}
          </Toggle>
        </div>
      </div>
      <div className="min-h-screen">
        {showConferences ? (
          <OrganizedConferenceComponent />
        ) : (
          <SubmittedPaperComponent />
        )}
      </div>
    </div>
  );
};

export default Page;