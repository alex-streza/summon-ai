import { NextApiRequest, NextApiResponse } from "next";
import { openApiDocument } from "../../server/trpc/router/_app";

const hander = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument);
};

export default hander;
