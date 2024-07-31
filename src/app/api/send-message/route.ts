import dbConnect from "@/app/lib/dbConfig";
import UserModel, { Message } from "@/app/models/Users";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  const { username, content } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json(
      { success: false, message: "User not Authenticated" },
      { status: 401 }
    );
  }

  if (session.user.username != username) {
    return Response.json(
      { success: false, message: "User not Authenticated" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not Found" },
        { status: 401 }
      );
    }

    const message = { content, createdAt: new Date() };

    user.messages.push(message as Message);

    await user.save();

    return Response.json(
      { success: true, message: "Message Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
