import crypto from "crypto";
import db from "@/lib/db";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "raed_admin_session";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: number) {
  const sessionToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.execute(
    `
      INSERT INTO admin_sessions
      (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `,
    [userId, sessionToken, expiresAt]
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  if (!sessionToken) {
    return null;
  }

  const [rows] = await db.execute(
    `
      SELECT
        u.id,
        u.email,
        u.role
      FROM admin_sessions s
      INNER JOIN users u
        ON u.id = s.user_id
      WHERE s.session_token = ?
        AND s.expires_at > NOW()
      LIMIT 1
    `,
    [sessionToken]
  );

  const admins = rows as {
    id: number;
    email: string;
    role: string;
  }[];

  return admins[0] ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  if (sessionToken) {
    await db.execute(
      `
        DELETE FROM admin_sessions
        WHERE session_token = ?
      `,
      [sessionToken]
    );
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}