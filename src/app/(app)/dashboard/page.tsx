"use client";
import { useState, useEffect } from "react"; //Add useEffect
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetOrganizedConferencesQuery } from "@/store/features/ConferenceApiSlice";
import { useGetSubmittedPapersQuery } from "@/store/features/PaperApiSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PulseLoader } from "react-spinners";
import ReviewedPapersComponent from "./(reviewSystem)/ReviewPaperComponent";
import EditPopup from './EditPopup';
import EditConferencePopup from "./EditConferencePopup";
import { useParams } from 'next/navigation';
import { Toggle } from "@/components/ui/toggle";

// Organized Conferences Component
const OrganizedConferenceComponent = () => {
  const { data: organizedConferences, isLoading } = useGetOrganizedConferencesQuery();
  const params = useParams();

  //Use state to store the baseURL
  const [baseUrl, setBaseUrl] = useState('');

  //UseEffect to set the baseURL after the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  return (
    <div className='flex justify-center'>
      <Card className='w-full border border-gray-200'> {/* Added border and removed shadow */}
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
              {isLoading ? (
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

// Submitted Papers Component
const SubmittedPaperComponent = () => {
  const { data: submittedPapers, isLoading } = useGetSubmittedPapersQuery();

  return (
    <div className='flex justify-center items-start'>
      <Card className='w-full border border-gray-200'> {/* Added border and removed shadow */}
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
              {isLoading ? (
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

// Main Page
const Page: React.FC = () => {
  const [role, setRole] = useState<'Conference Chair' | 'Author'>('Conference Chair');
  const [activeTab, setActiveTab] = useState<'organized' | 'submitted' | 'reviewManagement'>('organized');

  const handleToggle = () => {
    const newRole = role === 'Conference Chair' ? 'Author' : 'Conference Chair';
    setRole(newRole);
    // Update the active tab based on the new role
    setActiveTab(newRole === 'Conference Chair' ? 'organized' : 'submitted');
  };

  // Explicitly type the onValueChange function to accept a string
  const handleTabChange = (value: string) => {
    if (value === 'organized' || value === 'submitted' || value === 'reviewManagement') {
      setActiveTab(value);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-lg font-medium text-gray-600">
            Current View: <span className="text-blue-600">{role}</span>
          </p>
          <Toggle
            aria-label="Toggle between Conference Chair and Author views"
            onClick={handleToggle}
            className={`flex items-center px-4 py-2 bg-gray-200 rounded-lg cursor-pointer transition-colors duration-300
              ${role === 'Conference Chair' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            {role === 'Conference Chair' ? (
              <span className="font-medium text-sm transition-opacity duration-300">Switch to Author</span>
            ) : (
              <span className="font-medium text-sm transition-opacity duration-300">Switch to Conference Chair</span>
            )}
          </Toggle>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex justify-center gap-6 mb-8">
            {role === 'Conference Chair' && (
              <TabsTrigger
                value="organized"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Organized Conferences
              </TabsTrigger>
            )}
            {role === 'Author' && (
              <TabsTrigger
                value="submitted"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Submitted Papers
              </TabsTrigger>
            )}
            {role === 'Conference Chair' && (
              <TabsTrigger
                value="reviewManagement"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Review Management
              </TabsTrigger>
            )}
          </TabsList>

          {role === 'Conference Chair' && (
            <TabsContent value="organized" className="p-4"> {/* Adjusted padding */}
              <OrganizedConferenceComponent />
            </TabsContent>
          )}
          {role === 'Author' && (
            <TabsContent value="submitted" className="p-4"> {/* Adjusted padding */}
              <SubmittedPaperComponent />
            </TabsContent>
          )}
          {role === 'Conference Chair' && (
            <TabsContent value="reviewManagement" className="p-4"> {/* Adjusted padding */}
              <ReviewedPapersComponent />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Page;