import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

type ReviewComment = { [key: string]: string }; //key-value pair for comments (e.g. "review1": "Great work! Please address the minor feedback.")

interface SendCommentMailTemplateProps {
  username: string;
  status: string;
  paperID: string;
  comment?: string; //make comment optional
  reviewerComments: ReviewComment
}

export const SendCommentMailTemplate = ({
  username,
  status,
  paperID,
  comment,
  reviewerComments,
}: SendCommentMailTemplateProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={tertiary}>Paper Review Notification</Text>

        <Heading style={secondary}>Update on Your Paper</Heading>

        <Text style={description}>
          Dear {username || "Author"}, we wanted to inform you about the recent updates on
          your paper (ID: {paperID || "N/A"}). Below are the details:
        </Text>

        <Section style={infoContainer}>
          <Text style={label}>Paper Status:</Text>
          <Text style={value}>{status}</Text>
        </Section>

        <Section style={infoContainer}>
          <Text style={label}>Comment:</Text>
          <Text style={value}>{comment || "No comments available"}</Text>
        </Section>

        {Object.entries(reviewerComments).length > 0 ? (
          Object.entries(reviewerComments).map(([review, comment], index) => (
            <Section style={infoContainer} key={index}>
              <Text style={label}>{review}:</Text>
              <Text style={value}>{comment}</Text>
            </Section>
          ))
        ) : (
          <Section style={infoContainer}>
            <Text style={value}>No reviewer comments available</Text>
          </Section>
        )}

        <Text style={paragraph}>
          Thank you for your submission, and please contact us if you have any
          questions.
        </Text>
      </Container>

      <Text style={footer}>Powered securely by MYCONF</Text>
    </Body>
  </Html>
);

SendCommentMailTemplate.PreviewProps = {
  username: "Author Name",
  status: "Approved",
  paperID: "123456",
  comment: "Great work! Please address the minor feedback.",
  reviewerComments: {
    "Reviewer 1": "Great work! Please address the minor feedback.",
    "Reviewer 2": "Good job! Please address the major feedback.",
  },
};

export default SendCommentMailTemplate;

const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  padding: "40px 20px",
  maxWidth: "600px",
  margin: "0 auto",
};

const tertiary: React.CSSProperties = {
  color: "#0a85ea",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase",
  textAlign: "center",
  marginBottom: "10px",
};

const secondary: React.CSSProperties = {
  color: "#333",
  fontSize: "22px",
  fontWeight: 600,
  textAlign: "center",
  marginBottom: "20px",
};

const description: React.CSSProperties = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center",
  marginBottom: "30px",
};

const infoContainer: React.CSSProperties = {
  backgroundColor: "#f1f3f5",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "15px",
};

const label: React.CSSProperties = {
  color: "#777",
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "uppercase",
};

const value: React.CSSProperties = {
  color: "#333",
  fontSize: "16px",
  marginTop: "5px",
};

const paragraph: React.CSSProperties = {
  color: "#777",
  fontSize: "14px",
  textAlign: "center",
  lineHeight: "22px",
  marginTop: "10px",
  padding: "0 20px",
};

const footer: React.CSSProperties = {
  color: "#888",
  fontSize: "12px",
  textAlign: "center",
  marginTop: "30px",
};
