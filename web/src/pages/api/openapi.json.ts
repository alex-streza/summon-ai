import { NextApiRequest, NextApiResponse } from "next";
import { openApiDocument } from "../../server/trpc/router/_app";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument);
};

export default handler;
