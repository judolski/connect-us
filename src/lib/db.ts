import mongoose from "mongoose";

export async function connectToDatabase() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log(
    (await mongoose.connect(process.env.MONGODB_URI!)).ConnectionStates
  );
}
