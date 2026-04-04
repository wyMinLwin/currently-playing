import { cookies } from "next/headers";
import { validateSession, SESSION_COOKIE } from "./session";
import { redirect } from "next/navigation";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/connect");
  }

  const user = await validateSession(token);

  if (!user) {
    redirect("/connect");
  }

  return user;
}
