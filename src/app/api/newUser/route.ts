import { connectToDatabase } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "../controllers/accountController";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectToDatabase();

  await createUser(req);
}
