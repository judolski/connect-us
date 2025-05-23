// import mongoose from "mongoose";

// export async function connectToDatabase() {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(process.env.MONGODB_URI!);
// }

import mongoose from "mongoose";

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined!");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(uri);
}
