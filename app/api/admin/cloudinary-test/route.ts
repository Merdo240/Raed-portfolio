import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 1,
    });

    return NextResponse.json({
      success: true,
      message: "Cloudinary API connection successful.",
      resources: result.resources.length,
    });
  } catch (error) {
    console.error("Cloudinary test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Cloudinary API connection failed.",
      },
      { status: 500 }
    );
  }
}