import { verificationEmailTemplate } from "@/app/components/email/VerificationEmail";
import { Resend } from "@/app/lib/resend"; //Import Api Key from lib
import { ApiResponse } from "@/app/types/ApiResponse";

const resend = Resend;

export async function POST(name: string, code: string): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["slacks.425@gmail.com"],
      subject: `VerifiCation Code for ${name}`,
      react: verificationEmailTemplate({ firstName: name, code }),
    });

    return { success: true, message: "Verfication Email Sended Successfully" };
  } catch (error) {
    console.error("Verfication Email Failed", error);
    return { success: false, message: "Verfication Email Failed" };
  }
}
