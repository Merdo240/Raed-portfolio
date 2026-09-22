import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({
  input,
  output,
});

const email = await rl.question("Admin email: ");
const password = await rl.question("Admin password: ");
const confirmPassword = await rl.question("Confirm password: ");

rl.close();

if (!email.trim() || !password || !confirmPassword) {
  console.error("Email and password are required.");
  process.exit(1);
}

if (password !== confirmPassword) {
  console.error("Passwords do not match.");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "raed_portfolio",
  port: Number(process.env.DB_PORT || 3306),
});

try {
  await db.execute(
    `
      INSERT INTO users (email, password_hash, role)
      VALUES (?, ?, 'admin')
    `,
    [email.trim().toLowerCase(), passwordHash]
  );

  console.log("\nAdmin created successfully.");
} catch (error) {
  if (error.code === "ER_DUP_ENTRY") {
    console.error("\nThis email already exists.");
  } else {
    console.error("\nFailed to create admin:", error.message);
  }

  process.exitCode = 1;
} finally {
  await db.end();
}