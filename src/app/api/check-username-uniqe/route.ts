import dbConnect from "@/app/lib/dbConfig";
import UserModel from "@/app/models/Users";
import { SignUpSchema, usernameValidation } from "@/app/schemas/SignUpSchema";


export async function GET(request: Request) {

 

  const { searchParams } = new URL(request.url);

  const username =  searchParams.get("username")

  //Check if Username is Valid 

  const result = usernameValidation.safeParse(username);



  console.log(result)
  console.log(username)

  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Username Does not Exist Special Charaters",
      },
      { status: 400 }
    );
  } else {
    //Check with DB if usernmae Exists
    await dbConnect();

    try {
      const result = await UserModel.findOne({
        username,
     
      });

      console.log("Resurlkt ", result)

      if (!result?.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Please Verify your Account",
          },
          { status: 400 })
      }
      

      if (result) {
        return Response.json(
          {
            success: false,
            message: "Username already Exists",
          },
          { status: 400 }
        );

      } 
      if (!result) {
        return Response.json(
          {
            success: true,
            message: "Username is Uniqe",
          },
          { status: 200 }
        );
      }

      
    } catch (error) {
      console.log("Error Checking Username Uniqe ", error);
      return Response.json(
        {
          success: false,
          message: "Error Checking Username Uniqe",
        },
        { status: 400 }
      );
    }
  }
}
