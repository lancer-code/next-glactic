import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/models/Users";
import { z } from "zod";

export async function POST(request: Request) {
  const emailCheck = z.string().email();

  const { email } = await request.json();

  const result = emailCheck.safeParse(email);

  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Enter a Valid Email",
      },
      { status: 400 }
    );
  }

  const newCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newExpiryDate = new Date(Date.now() + 3600000);

  try {
    const userData = await UserModel.findOne({ email });

    if (!userData) {
      return Response.json(
        {
          success: false,
          message: "User not Found, Please Enter a Valid Email",
        },
        { status: 400 }
      );
    }

    const updateNewCode = await UserModel.updateOne(
      { email },
      { verifyCode: newCode, verifyCodeExpiry: newExpiryDate }
    );

    if (updateNewCode) {
      await sendVerificationEmail(userData.username, newCode, email);
    }else{
      throw new Error()
    }

    return Response.json(
      {
        success: true,
        message: "Code Sent SuccessFully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to Crete New Verification Code", error);
    return Response.json(
      {
        success: false,
        message: "Failed to Crete New Verification Code",
      },
      { status: 400 }
    );
  }
}
