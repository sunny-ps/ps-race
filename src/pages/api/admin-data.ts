// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { getMongoDb } from "@lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getMongoDb("ps-race");

  switch (req.method) {
    case "GET":
      const response = db.collection("admin").find({});
      const data = await response.toArray();

      res.status(200).json(data);

      break;

    case "PUT":
    case "PATCH":
      const { dataType } = req.body;

      try {
        await db.collection("admin").updateOne(
          { type: "data" },
          {
            $set: { revenueType: dataType },
          }
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        res.status(500).json({ statusCode: 500, message: errorMessage });
      }

      return res.status(200).send("Data type has been successfully updated");

    default:
      res.status(405).end("Method Not Allowed");
  }
}
