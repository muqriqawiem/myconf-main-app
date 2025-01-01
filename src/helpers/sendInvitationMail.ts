import sgMail from "@sendgrid/mail";
import { render } from "@react-email/components";
import { ApiResponse } from '@/types/ApiResponse';
import InvitationEmailTemplate from "../../emails/InvitationEmailTemplate";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendInvitationMail(
    recipientEmail: string,
    senderName: string,
    message: string
):Promise<ApiResponse>{
    console.log(recipientEmail,senderName,message) 
    try {
        await sgMail.send({
            from: "u2000778@siswa.um.edu.my",
            to: recipientEmail,
            subject: "Conference Invitation",
            html: render(InvitationEmailTemplate({senderName:senderName, message:message,})),
        });

        return {success:true,message:"invitation email send sucessfully"}
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send invitation email" };
    }
}
