import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/Users";
import { z } from "zod";

export async function POST(request: Request) {


  const { email, code } = await request.json();

  const verifyCodeValidation = z
    .string()
    .length(6, "The Code Must have 6 Characters");

  const result = verifyCodeValidation.safeParse(code);

  
  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Enter a 6 digit Code",
      },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const getUserByEmail = await UserModel.findOne({ email });

    if (!getUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "User not Exist, Please Sign Up",
        },
        { status: 400 }
      );
    }

    if (getUserByEmail) {
      if (getUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Account is Already Verified",
          },
          { status: 400 }
        );
      }
      //Checking Code Expiry
      const checkCodeExpiry =
        new Date(Date.now()) > getUserByEmail.verifyCodeExpiry ? true : false;

      if (checkCodeExpiry) {
        return Response.json(
          {
            success: false,
            message: "Verification Code Expired",
          },
          { status: 400 }
        );
      }

      if (!checkCodeExpiry) {
        //Comparing Codes
        const compareCode = code === getUserByEmail.verifyCode ? true : false;

        if (!compareCode) {
          return Response.json(
            {
              success: false,
              message: "Enter a Valid Code",
            },
            { status: 400 }
          );
        }

        if (compareCode) {
          try {
            //If Code Corect Update the Status in DB
            const updateUserStatuse = await UserModel.updateOne(
              { email },
              { isVerified: true }
            );

            if (!updateUserStatuse) {
              throw new Error();
            }

            return Response.json(
              {
                success: true,
                message: "Account Verification Completed",
              },
              { status: 200 }
            );
          } catch (error) {
            console.log("Failed to Upadte Account Statue", error);
            return Response.json(
              {
                success: false,
                message: "Failed to Upadte Account Statue",
              },
              { status: 400 }
            );
          }
        }
      }
    }
  } catch (error) {
    console.log("Failed to Verify Code:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to Verify Code",
      },
      { status: 400 }
    );
  }
}
