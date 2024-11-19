
import { env } from "~/env";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { type NextRequest } from "next/server";
import { GraphQLError } from "graphql";
import schema from "~/server/gql/schema";
import type { NextApiRequest, NextApiResponse } from "next/types";

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const headerKey = req.headers.get("control-key")

    if (headerKey !== env.CONTROL_KEY) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        }
      });
    }

    return { req }
  }
}) as {
  <HandlerReq extends NextApiRequest>(req: HandlerReq, res: NextApiResponse): Promise<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <HandlerReq extends NextRequest | Request>(req: HandlerReq, res?: any): Promise<Response>;
}

export { handler as GET, handler as POST };