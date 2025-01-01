import sgMail from "@sendgrid/mail";
import { render } from "@react-email/components";
import { ApiResponse } from '@/types/ApiResponse';
import React from 'react';
import InvitationEmailTemplate from '../../emails/InvitationEmailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendInvitationMail(
    recipientEmail: string,
    senderName: string,
    message: string
): Promise<ApiResponse> {
    try {
        const emailHtmlContent = render(
            React.createElement(InvitationEmailTemplate, { senderName, message })
        );

        await sgMail.send({
            from: "u2000778@siswa.um.edu.my",
            to: recipientEmail,
            subject: "Conference Invitation",
            html: emailHtmlContent,
        });

        console.log("Invitation email sent successfully");
        return { success: true, message: "Invitation email sent successfully" };
    } catch (emailError) {
        console.error("Error sending invitation email:", emailError);
        return { success: false, message: "Failed to send invitation email" };
    }
}
