import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
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
    <div>
        <h1>You've Been Invited!</h1>
        <p>{`Hello,`}</p>
        <p>{`${senderName} has invited you to join their conference.`}</p>
        <p>{`Message from the sender:`}</p>
        <blockquote>{message}</blockquote>
        <p>Thank you!</p>
    </div>
);

export default InvitationEmailTemplate;
