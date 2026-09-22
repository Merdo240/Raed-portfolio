import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";


/* =========================================================
   GET GROUPS
========================================================= */

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

    const [rows] = await db.execute(`
      SELECT
        id,
        name,
        slug,
        description,
        cover_image_url,
        cover_image_public_id,
        display_order,
        is_visible,
        created_at,
        updated_at
      FROM portfolio_groups
      ORDER BY display_order ASC, id ASC
    `);

    return NextResponse.json({
      success: true,
      groups: rows,
    });

  } catch (error) {
    console.error(
      "Admin groups GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch groups.",
      },
      { status: 500 }
    );
  }
}


/* =========================================================
   CREATE GROUP
========================================================= */

export async function POST(request: Request) {
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

    const body = await request.json();

    const name = String(
      body.name || ""
    ).trim();

    const slug = String(
      body.slug || ""
    )
      .trim()
      .toLowerCase();

    const description = body.description
      ? String(body.description).trim()
      : null;

    const coverImageUrl = body.coverImageUrl
      ? String(body.coverImageUrl).trim()
      : null;

    const coverImagePublicId =
      body.coverImagePublicId
        ? String(
            body.coverImagePublicId
          ).trim()
        : null;


    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name and slug are required.",
        },
        { status: 400 }
      );
    }


    /* -------------------------------------------------------
       Check duplicate slug
    ------------------------------------------------------- */

    const [existing] =
      await db.execute(
        `
          SELECT id
          FROM portfolio_groups
          WHERE slug = ?
          LIMIT 1
        `,
        [slug]
      );


    if (
      (existing as unknown[])
        .length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A group with this slug already exists.",
        },
        { status: 409 }
      );
    }


    /* -------------------------------------------------------
       Create group
    ------------------------------------------------------- */

    const [result] =
      await db.execute(
        `
          INSERT INTO portfolio_groups
          (
            name,
            slug,
            description,
            cover_image_url,
            cover_image_public_id,
            display_order,
            is_visible
          )
          VALUES (?, ?, ?, ?, ?, 0, TRUE)
        `,
        [
          name,
          slug,
          description,
          coverImageUrl,
          coverImagePublicId,
        ]
      );


    return NextResponse.json(
      {
        success: true,
        message:
          "Group created successfully.",
        id: (
          result as {
            insertId: number;
          }
        ).insertId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "Admin groups POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create group.",
      },
      { status: 500 }
    );
  }
}


/* =========================================================
   UPDATE GROUP
========================================================= */

export async function PUT(request: Request) {
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


    const body = await request.json();

    const id = Number(body.id);

    const name = String(
      body.name || ""
    ).trim();

    const slug = String(
      body.slug || ""
    )
      .trim()
      .toLowerCase();

    const description = body.description
      ? String(body.description).trim()
      : null;

    const newCoverImageUrl =
      body.coverImageUrl
        ? String(
            body.coverImageUrl
          ).trim()
        : null;

    const newCoverImagePublicId =
      body.coverImagePublicId
        ? String(
            body.coverImagePublicId
          ).trim()
        : null;


    if (!id || !name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ID, name and slug are required.",
        },
        { status: 400 }
      );
    }


    /* -------------------------------------------------------
       Get current group
    ------------------------------------------------------- */

    const [currentRows] =
      await db.execute(
        `
          SELECT
            id,
            cover_image_url,
            cover_image_public_id
          FROM portfolio_groups
          WHERE id = ?
          LIMIT 1
        `,
        [id]
      );


    const currentGroup =
      (
        currentRows as Array<{
          id: number;
          cover_image_url:
            | string
            | null;
          cover_image_public_id:
            | string
            | null;
        }>
      )[0];


    if (!currentGroup) {
      return NextResponse.json(
        {
          success: false,
          message: "Group not found.",
        },
        { status: 404 }
      );
    }


    /* -------------------------------------------------------
       Check duplicate slug
    ------------------------------------------------------- */

    const [existing] =
      await db.execute(
        `
          SELECT id
          FROM portfolio_groups
          WHERE slug = ?
            AND id != ?
          LIMIT 1
        `,
        [slug, id]
      );


    if (
      (existing as unknown[])
        .length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another group already uses this slug.",
        },
        { status: 409 }
      );
    }


    /* -------------------------------------------------------
       Detect image change
    ------------------------------------------------------- */

    const imageChanged =
      newCoverImagePublicId !==
      currentGroup.cover_image_public_id;


    /* -------------------------------------------------------
       Update MySQL
    ------------------------------------------------------- */

    const [result] =
      await db.execute(
        `
          UPDATE portfolio_groups
          SET
            name = ?,
            slug = ?,
            description = ?,
            cover_image_url = ?,
            cover_image_public_id = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [
          name,
          slug,
          description,
          newCoverImageUrl,
          newCoverImagePublicId,
          id,
        ]
      );


    const affectedRows = (
      result as {
        affectedRows: number;
      }
    ).affectedRows;


    if (affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Group was not updated.",
        },
        { status: 400 }
      );
    }


    /* -------------------------------------------------------
       Delete old cover from Cloudinary
       Only when image changed
    ------------------------------------------------------- */

    if (
      imageChanged &&
      currentGroup.cover_image_public_id
    ) {
      try {
        await cloudinary.uploader.destroy(
          currentGroup.cover_image_public_id,
          {
            resource_type: "image",
          }
        );

      } catch (cloudinaryError) {
        console.error(
          "Failed to delete old Cloudinary image:",
          cloudinaryError
        );
      }
    }


    return NextResponse.json({
      success: true,
      message:
        "Group updated successfully.",
    });

  } catch (error) {
    console.error(
      "Admin groups PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update group.",
      },
      { status: 500 }
    );
  }
}


/* =========================================================
   DELETE GROUP
   حذف المجموعة + جميع صورها من MySQL و Cloudinary
========================================================= */

export async function DELETE(request: Request) {
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

    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Group ID is required.",
        },
        { status: 400 }
      );
    }

    /*
    -------------------------------------------------------
    1. Get group cover image
    -------------------------------------------------------
    */

    const [groupRows] = await db.execute(
      `
        SELECT
          id,
          cover_image_public_id
        FROM portfolio_groups
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    const group = (
      groupRows as Array<{
        id: number;
        cover_image_public_id: string | null;
      }>
    )[0];

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          message: "Group not found.",
        },
        { status: 404 }
      );
    }

    /*
    -------------------------------------------------------
    2. Get all images belonging to the group
    -------------------------------------------------------
    */

    const [imageRows] = await db.execute(
      `
        SELECT
          id,
          public_id
        FROM portfolio_images
        WHERE group_id = ?
      `,
      [id]
    );

    const images = imageRows as Array<{
      id: number;
      public_id: string | null;
    }>;

    /*
    -------------------------------------------------------
    3. Delete cover from Cloudinary
    -------------------------------------------------------
    */

    if (group.cover_image_public_id) {
      try {
        const result =
          await cloudinary.uploader.destroy(
            group.cover_image_public_id,
            {
              resource_type: "image",
              invalidate: true,
            }
          );

        console.log(
          "Deleted group cover from Cloudinary:",
          group.cover_image_public_id,
          result
        );

      } catch (cloudinaryError) {
        console.error(
          "Failed to delete group cover:",
          cloudinaryError
        );
      }
    }

    /*
    -------------------------------------------------------
    4. Delete all portfolio images from Cloudinary
    -------------------------------------------------------
    */

    for (const image of images) {
      if (!image.public_id) {
        continue;
      }

      try {
        const result =
          await cloudinary.uploader.destroy(
            image.public_id,
            {
              resource_type: "image",
              invalidate: true,
            }
          );

        console.log(
          "Deleted portfolio image from Cloudinary:",
          image.public_id,
          result
        );

      } catch (cloudinaryError) {
        console.error(
          `Failed to delete Cloudinary image ${image.public_id}:`,
          cloudinaryError
        );
      }
    }

    /*
    -------------------------------------------------------
    5. Delete images from MySQL
    -------------------------------------------------------
    */

    await db.execute(
      `
        DELETE FROM portfolio_images
        WHERE group_id = ?
      `,
      [id]
    );

    /*
    -------------------------------------------------------
    6. Delete group from MySQL
    -------------------------------------------------------
    */

    const [result] = await db.execute(
      `
        DELETE FROM portfolio_groups
        WHERE id = ?
      `,
      [id]
    );

    const affectedRows = (
      result as {
        affectedRows: number;
      }
    ).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Group was not deleted.",
        },
        { status: 400 }
      );
    }

    /*
    -------------------------------------------------------
    7. Success
    -------------------------------------------------------
    */

    return NextResponse.json({
      success: true,
      message:
        "Group, cover image and all portfolio images deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Admin groups DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete group.",
      },
      { status: 500 }
    );
  }
}