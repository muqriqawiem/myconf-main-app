import {
    Html,
    Head,
    Body,
    Container,
    Preview,
    Heading,
    Section,
    Text,
} from '@react-email/components';

interface InvitationEmailTemplateProps {
    senderName: string;
    message: string;
}

const InvitationEmailTemplate: React.FC<InvitationEmailTemplateProps> = ({
    senderName,
    message,
}) => (
    <Html>
        <Head>
            {/* Add any fonts or styles if necessary */}
        </Head>
        <Body style={main}>
            <Container style={container}>
                <Preview>You&apos;ve Been Invited!</Preview>
                <Text style={tertiary}>Conference Invitation</Text>
                <Heading style={secondary}>You&apos;ve Been Invited!</Heading>
                <Text style={description}>
                    Hello,
                </Text>
                <Text style={description}>
                    {`${senderName} has invited you to join their conference.`}
                </Text>
                <Text style={description}>
                    Message from the sender:
                </Text>
                <Section style={messageContainer}>
                    <Text style={messageStyle}>{message}</Text>
                </Section>
                <Text style={paragraph}>Thank you!</Text>
            </Container>
            <Text style={footer}>Powered securely by MYCONF</Text>
        </Body>
    </Html>
);

export default InvitationEmailTemplate;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
};

const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #eaeaea",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    padding: "40px 20px",
    maxWidth: "400px",
    margin: "0 auto",
};

const tertiary = {
    color: "#0a85ea",
    fontSize: "12px",
    fontWeight: "bold" as const,
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
    marginBottom: "10px",
};

const secondary = {
    color: "#333",
    fontSize: "22px",
    fontWeight: 600,
    textAlign: "center" as const,
    marginBottom: "20px",
};

const description = {
    color: "#555",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center" as const,
    marginBottom: "30px",
};

const messageContainer = {
    backgroundColor: "#f1f3f5",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    textAlign: "center" as const,
};

const messageStyle = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
};

const paragraph = {
    color: "#777",
    fontSize: "14px",
    textAlign: "center" as const,
    lineHeight: "22px",
    marginTop: "10px",
    padding: "0 20px",
};

const footer = {
    color: "#888",
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "30px",
};
