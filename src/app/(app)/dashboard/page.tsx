"use client";
import { useState, useEffect } from "react";
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
import { useGetOrganizedSessionsQuery } from "@/store/features/SessionApiSlice";
import { useGetSubmittedPapersQuery } from "@/store/features/PaperApiSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PulseLoader } from "react-spinners";
import ReviewedPapersComponent from "./(reviewSystem)/ReviewPaperComponent";
import EditPopup from "./EditPopup";
import EditConferencePopup from "./EditConferencePopup";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Toggle } from "@/components/ui/toggle";
import EditSessionPopup from "./EditSessionPopup";
import PaymentButton from "../(payment)/pricing/PaymentButton";

export const dynamic = "force-dynamic";

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to end this conference?
        </h2>
        <p className="text-gray-600 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            aria-label={isLoading ? "Ending Conference" : "End Conference"}
          >
            {isLoading ? "Ending..." : "End Conference"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Organized Conferences Component
const OrganizedConferenceComponent = () => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedConferenceId, setSelectedConferenceId] = useState<string | null>(null);
  const [isEndingConference, setIsEndingConference] = useState(false);

  const { data: organizedConferences, isLoading, isFetching, refetch } = useGetOrganizedConferencesQuery();
  const params = useParams();

  // Use state to store the baseURL
  const [baseUrl, setBaseUrl] = useState("");

  // UseEffect to set the baseURL after the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const handleEndConferenceClick = (conferenceId: string) => {
    setSelectedConferenceId(conferenceId);
    setIsConfirmationOpen(true);
  };

  const confirmEndConference = async () => {
    if (!selectedConferenceId) return;

    setIsEndingConference(true); // Start loading
    try {
      const response = await fetch("/api/end-conference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conferenceId: selectedConferenceId }),
      });

      if (response.ok) {
        toast.success("Conference has been marked as ended.");
        refetch(); // Refresh data
      } else {
        const errorData = await response.json();
        if (response.status === 404) {
          toast.error("Conference not found.");
        } else if (response.status === 400) {
          toast.error("Invalid request. Please check the conference ID.");
        } else {
          toast.error(errorData.error || "Failed to end conference.");
        }
      }
    } catch (error) {
      console.error("Error ending conference:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsEndingConference(false); // Stop loading
      setIsConfirmationOpen(false);
      setSelectedConferenceId(null);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full border border-gray-200">
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
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <PulseLoader size={6} />
                  </TableCell>
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
                            <Button variant={"outline"}>View Papers</Button>
                          </Link>
                          <Link href={invitationUrl} target="_blank">
                            <Button variant={"outline"}>Send Invitation</Button>
                          </Link>
                          <EditConferencePopup conferenceDetails={organizedConference} />
                          <PaymentButton isPaid={organizedConference.conferenceSecurityDeposit2000Paid} />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEndConferenceClick(organizedConference._id)}
                            disabled={organizedConference.conferenceLifecycleStatus === "ended"}
                            aria-label={
                              organizedConference.conferenceLifecycleStatus === "ended"
                                ? "Conference Ended"
                                : "End Conference"
                            }
                            aria-disabled={organizedConference.conferenceLifecycleStatus === "ended"}
                            className={
                              organizedConference.conferenceLifecycleStatus === "ended"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          >
                            {organizedConference.conferenceLifecycleStatus === "ended"
                              ? "Conference Ended"
                              : "End Conference"}
                          </Button>
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

      {/* End Conference Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmEndConference}
        isLoading={isEndingConference}
      />
    </div>
  );
};

// Organized Sessions Component
const OrganizedSessionComponent = () => {
  const { data: organizedSessions, isLoading } = useGetOrganizedSessionsQuery(); // Fetch organized sessions
  const params = useParams();

  return (
    <div className="flex justify-center">
      <Card className="w-full border border-gray-200">
        <CardHeader>
          <CardTitle>Organized Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="w-full justify-center items-center text-center">
                  <TableCell colSpan={3}>
                    <span className="">
                      Loading <PulseLoader className="inline-block" size={6} />
                    </span>
                  </TableCell>
                </TableRow>
              ) : organizedSessions && organizedSessions.length > 0 ? (
                organizedSessions.map((organizedSession: any) => (
                  <TableRow key={organizedSession._id}>
                    <TableCell className="font-medium">{organizedSession.title}</TableCell>
                    <TableCell>{moment(organizedSession.createdAt).calendar()}</TableCell>
                    <TableCell>
                      <EditSessionPopup sessionDetails={organizedSession} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No organized sessions found</TableCell>
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
    <div className="flex justify-center items-start">
      <Card className="w-full border border-gray-200">
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
                  <TableCell colSpan={5}>
                    <span className="">
                      Loading <PulseLoader className="inline-block" size={6} />
                    </span>
                  </TableCell>
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
                    <TableCell>
                      <EditPopup {...submittedPaper} />
                    </TableCell>
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
  const [role, setRole] = useState<"Conference Chair" | "Author">("Conference Chair");
  const [activeTab, setActiveTab] = useState<"organized" | "submitted" | "reviewManagement" | "organizedSessions">(
    "organized"
  );

  const handleToggle = () => {
    const newRole = role === "Conference Chair" ? "Author" : "Conference Chair";
    setRole(newRole);
    // Update the active tab based on the new role
    setActiveTab(newRole === "Conference Chair" ? "organized" : "submitted");
  };

  // Explicitly type the onValueChange function to accept a string
  const handleTabChange = (value: string) => {
    if (
      value === "organized" ||
      value === "submitted" ||
      value === "reviewManagement" ||
      value === "organizedSessions"
    ) {
      setActiveTab(value);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-lg font-medium text-gray-600">
            Current View: <span className="text-blue-600">{role}</span>
          </p>
          <Toggle
            aria-label="Toggle between Conference Chair and Author views"
            onClick={handleToggle}
            className={`flex items-center px-4 py-2 bg-gray-200 rounded-lg cursor-pointer transition-colors duration-300 ${role === "Conference Chair" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
          >
            {role === "Conference Chair" ? (
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
            {role === "Conference Chair" && (
              <TabsTrigger
                value="organized"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Organized Conferences
              </TabsTrigger>
            )}
            {role === "Author" && (
              <TabsTrigger
                value="submitted"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Submitted Papers
              </TabsTrigger>
            )}
            {role === "Conference Chair" && (
              <TabsTrigger
                value="reviewManagement"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Review Management
              </TabsTrigger>
            )}
            {role === "Conference Chair" && (
              <TabsTrigger
                value="organizedSessions"
                className="flex-1 text-center text-base font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
              >
                Organized Sessions
              </TabsTrigger>
            )}
          </TabsList>

          {role === "Conference Chair" && (
            <TabsContent value="organized" className="p-4">
              <OrganizedConferenceComponent />
            </TabsContent>
          )}
          {role === "Author" && (
            <TabsContent value="submitted" className="p-4">
              <SubmittedPaperComponent />
            </TabsContent>
          )}
          {role === "Conference Chair" && (
            <TabsContent value="reviewManagement" className="p-4">
              <ReviewedPapersComponent />
            </TabsContent>
          )}
          {role === "Conference Chair" && (
            <TabsContent value="organizedSessions" className="p-4">
              <OrganizedSessionComponent />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Page;