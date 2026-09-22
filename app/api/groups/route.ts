import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        slug,
        description,
        cover_image_url,
        display_order
      FROM portfolio_groups
      WHERE is_visible = TRUE
      ORDER BY display_order ASC, id ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Groups API error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch groups",
      },
      { status: 500 }
    );
  }
}