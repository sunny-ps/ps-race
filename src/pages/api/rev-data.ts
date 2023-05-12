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
      const response = db.collection("revenue").find({});
      const data = await response.toArray();

      res.status(200).json(data);

      break;

    case "PUT":
    case "PATCH":
      const { revData } = req.body;

      revData.map(async (x: any) => {
        try {
          await db.collection("revenue").updateOne(
            { industry: x[0] },
            {
              $set: { workSold: x[1], revenueGuide: x[3] },
              $currentDate: { lastModified: true },
            }
          );
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Internal server error";
          res.status(500).json({ statusCode: 500, message: errorMessage });
        }
      });

      return res.status(200).send("Revenue data has been successfully updated");

    default:
      res.status(405).end("Method Not Allowed");
  }
}
