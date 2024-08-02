import dbConnect from "@/lib/dbConfig";
import UserModel from "@/models/Users";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

//Update isAcceptingMesaages Statue
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("User is not Authenticated");
    return Response.json(
      { success: false, message: "User is not Authenticated" },
      { status: 401 }
    );
  }
  const user = session.user;

  const userId = user._id;

  await dbConnect();

  try {
    const setAcceptMessage = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: true },
      { new: true }
    );

    if (!setAcceptMessage) {
      throw new Error();
    }

    return Response.json(
      {
        success: true,
        message: "isAcceptingMessages Status Updated Successfully",
        setAcceptMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to Update isAcceptingMessages Status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to Update isAcceptingMessages Status",
      },
      { status: 500 }
    );
  }
}

//Checking isAcceptingMessages Statue

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !user) {
    console.log("User is not Authenticated");
    return Response.json(
      { success: false, message: "User is not Authenticated" },
      { status: 401 }
    );
  }
  const user = session.user;

  const userId = user._id;

  await dbConnect();

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "Failed to Find User" },
        { status: 401 }
      );
    }

    const status = foundUser.isAcceptingMessage;

    return Response.json(
      { success: true, message: "Got isAcceptingMessages Statue", status },
      { status: 401 }
    );
  } catch (error) {
    console.log("Failed to get isAcceptingMessage Statue", error);
    return Response.json(
      { success: false, message: "Failed to get isAcceptingMessage Statue" },
      { status: 401 }
    );
  }
}
