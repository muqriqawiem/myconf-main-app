import sgMail from '@sendgrid/mail'; //uncomment this if want to use SendGrid
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import VerificationEmail from '../../emails/VerificationEmail'
import { render } from '@react-email/components';
import { ApiResponse } from '@/types/ApiResponse';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
//const resend = new Resend(process.env.RESEND_API_KEY) //newly added to accommodate using Resend

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        console.log(email)
        await sgMail.send({
            from: 'u2000726@siswa.um.edu.my',
            to: email,
            subject: 'MYCONF Account Verification code',
            html:render(VerificationEmail({username,otp:verifyCode})),
          });
          console.log("Your mail have been sent sucessfully")
        return {success:true,message:"verification email send sucessfully"}
    } catch (emailError) {
        console.log("error sending verification email",emailError)
        return {success:false,message:"failed to send verification email"}
    }
}
