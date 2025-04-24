import { connectToDatabase } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "./controllers/accountController";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseModel>
) {
  await connectToDatabase();

  await createUser(req, res);
}
