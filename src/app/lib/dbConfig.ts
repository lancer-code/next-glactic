import mongoose from "mongoose";

type ConnectionObj = {
  isConnected?: Number;
};

const connection : ConnectionObj = {}

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB is Already Connected!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB connection Failed", error);

    process.exit(1);
  }
}

export default dbConnect;
