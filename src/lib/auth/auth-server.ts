import { headers } from "next/headers";
import { auth } from "./auth";

export const getServerAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export type TSession = typeof auth.$Infer.Session;
