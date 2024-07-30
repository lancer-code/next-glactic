import dbConnect from "@/app/lib/dbConfig";
import UserModel from "@/app/models/Users";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Username",
          type: "email ",
          placeholder: "example@me.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            email: credentials.identifer,
          });

          if (!user) {
            throw new Error("User Not Found");
          }

          if (!user.isVerifed) {
            throw new Error("Please Verify your Account First");
          }

          const userPass = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (userPass) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          console.error("Error in Authentication ", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    //Modefying Jwt, puting user data in token, and token data in session, so that we don't need to reach DB for user date every time
    //when we need to use user information in other areas of App
    async session({ session, token }) {
      console.log("Session Call BAck")
      if (token) {
        session.user._id = token._id;
        session.user.isVerifed = token.isVerifed;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT Call BAck")
      if (user) {
        token._id = user._id;
        token.isVerifed = user.isVerifed;
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }

      return token;
    },
  },

  secret: process.env.AUTH_SECRET,
};
