import { verificationEmailTemplate } from "@/components/email/VerificationEmail";
import { Resend } from "@/lib/resend"; //Import Api Key from lib
import { ApiResponse } from "@/types/ApiResponse";

const resend = Resend;



export async function sendVerificationEmail(
  username: string,
  code: string,
  email: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: `VerifiCation Code for ${username}`,
      react: verificationEmailTemplate({ username, code, email }),
    });

    return { success: true, message: "Verfication Email Sended Successfully" };
  } catch (error) {
    console.error("Verfication Email Failed", error);
    return { success: false, message: "Verfication Email Failed" };
  }
}
