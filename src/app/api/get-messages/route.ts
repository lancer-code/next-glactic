import dbConnect from "@/app/lib/dbConfig";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/app/models/Users";
import mongoose from "mongoose";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("User is not Authenticated");
    return Response.json(
      { success: false, message: "User is not Authenticated" },
      { status: 401 }
    );
  }
  const user = session.user;

  const userId = new mongoose.Types.ObjectId(user._id);

  await dbConnect();

  try {
    //Aggregation Code

    const user = await UserModel.aggregate([
      { $match: userId },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user) {
      return Response.json(
        { success: false, message: "User not Found" },
        { status: 401 }
      );
    }

    if (user.length === 0) {
      return Response.json(
        { success: false, message: "No Messages found" },
        { status: 401 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get Messages", error);
    return Response.json(
      { success: false, message: "Failed to get Messages" },
      { status: 500 }
    );
  }
}
