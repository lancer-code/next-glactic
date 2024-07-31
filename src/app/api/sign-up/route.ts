import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import dbConnect from "@/app/lib/dbConfig";
import UserModel from "@/app/models/Users";
import { usernameValidation } from "@/app/schemas/SignUpSchema";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json(); //Extracting Data from the Comming Request from sign up Component

    const checkUsername = usernameValidation.safeParse(username)

    if (!checkUsername.success) {
      return Response.json(
        {
          success: false,
          message: "Enter a Valid Username",
        },
        { status: 400 }
      );
    }
   
    const existingUserVerifedByUsername = await UserModel.findOne({
      //Checking User By Username
      username,
    });

    if (existingUserVerifedByUsername) {
      if (!existingUserVerifedByUsername?.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already Exists, But please Verify your account",
          },
          { status: 400 }
        );
      }

      return Response.json(
        { success: false, message: "Username Already Exists!" },
        { status: 400 }
      );
    }

    //Checking User by Email
    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (!existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already Exists, But Please verify your Acount",
          },
          { status: 400 }
        );
      }
      //Check if eamil is Verfied
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email Already Exists",
          },
          { status: 400 }
        );
      } else {
        const hashPass = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashPass;
        (existingUserByEmail.verifyCode = verifyCode),
          (existingUserByEmail.verifyCodeExpiry = new Date(
            Date.now() + 3600000
          ));

        await existingUserByEmail.save();
      }
    } else {
      //If not Found, Create the New User in DB
      const hashedPass = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPass,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerifed: false,
        messages: [],
      });

      await newUser.save();
    }

    //Send Verification Email

    const EmailResponse = await sendVerificationEmail(
      username,
      verifyCode,
      email
    );

    console.log(EmailResponse)

    if (!EmailResponse.success) {
      return Response.json(
        {
          success: false,
          message: EmailResponse.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to Register User ", error);

    return Response.json(
      { success: false, message: `Failed to Register User` },
      { status: 500 }
    );
  }
}
