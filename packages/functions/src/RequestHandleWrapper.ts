import { CallableContext } from "firebase-functions/lib/providers/https";
import * as functions from "firebase-functions";

export type RequestHandler<T> = (request: T, callerId: string) => Promise<any>;

export function handler<T>(requestHandler: RequestHandler<T>) {
  return functions.https.onCall(async (data: T, context: CallableContext) => {
    const callerId = context.auth?.uid;
    if (!callerId) {
      throw new Error("Unauthorized");
    }

    return await requestHandler(data, callerId);
  });
}
