import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    // otp: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        const response = await resend.emails.send({
            from: 'ayush0146patel@gmail.com',
            // from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry message | Verification code',
            react: VerificationEmail({username, otp: verifyCode})
        })
        console.log(response);
        return {success: true, message: "Verification code send successfully"}
    } catch (emailError) {
        console.log("Error sending email", emailError);
        return {success: false, message: 'Failed to send Verification email'}
    }
}