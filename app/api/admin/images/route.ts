import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

/*
=========================================================
GET
جلب صور Group معين
=========================================================
*/

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const groupId = Number(searchParams.get("groupId"));

    if (!groupId) {
      return NextResponse.json(
        {
          success: false,
          message: "Group ID is required.",
        },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(
      `
        SELECT
          id,
          group_id,
          image_url,
          public_id,
          display_order,
          is_visible,
          created_at,
          updated_at
        FROM portfolio_images
        WHERE group_id = ?
        ORDER BY display_order ASC, id ASC
      `,
      [groupId]
    );

    return NextResponse.json({
      success: true,
      images: rows,
    });
  } catch (error) {
    console.error("Admin images GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch images.",
      },
      { status: 500 }
    );
  }
}

/*
=========================================================
POST
إضافة صورة موجودة في Cloudinary إلى Group
=========================================================
*/

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

    const groupId = Number(body.groupId);

    const imageUrl = body.imageUrl
      ? String(body.imageUrl).trim()
      : "";

    const publicId = body.publicId
      ? String(body.publicId).trim()
      : "";

    if (!groupId) {
      return NextResponse.json(
        {
          success: false,
          message: "Group ID is required.",
        },
        { status: 400 }
      );
    }

    if (!imageUrl || !publicId) {
      return NextResponse.json(
        {
          success: false,
          message: "Image URL and public ID are required.",
        },
        { status: 400 }
      );
    }

    const [groups] = await db.execute(
      `
        SELECT id
        FROM portfolio_groups
        WHERE id = ?
        LIMIT 1
      `,
      [groupId]
    );

    if ((groups as unknown[]).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Group not found.",
        },
        { status: 404 }
      );
    }

    const [orderRows] = await db.execute(
      `
        SELECT
          COALESCE(MAX(display_order), -1) AS max_order
        FROM portfolio_images
        WHERE group_id = ?
      `,
      [groupId]
    );

    const maxOrder =
      (
        orderRows as Array<{
          max_order: number;
        }>
      )[0]?.max_order ?? -1;

    const displayOrder = maxOrder + 1;

    const [result] = await db.execute(
      `
        INSERT INTO portfolio_images
        (
          group_id,
          image_url,
          public_id,
          display_order,
          is_visible
        )
        VALUES (?, ?, ?, ?, TRUE)
      `,
      [
        groupId,
        imageUrl,
        publicId,
        displayOrder,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Image added successfully.",
        id: (
          result as {
            insertId: number;
          }
        ).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin images POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add image.",
      },
      { status: 500 }
    );
  }
}

/*
=========================================================
PUT
تعديل صورة واحدة
- إظهار / إخفاء
- تعديل ترتيب صورة واحدة
=========================================================
*/

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

    /*
    -------------------------------------------------------
    ترتيب مجموعة كاملة
    -------------------------------------------------------
    */

    if (
      body.groupId !== undefined &&
      Array.isArray(body.orderedIds)
    ) {
      const groupId = Number(body.groupId);
      const orderedIds = body.orderedIds.map(Number);

      if (!groupId) {
        return NextResponse.json(
          {
            success: false,
            message: "Group ID is required.",
          },
          { status: 400 }
        );
      }

      if (orderedIds.length === 0) {
        return NextResponse.json({
          success: true,
          message: "Order saved successfully.",
        });
      }

      if (
        orderedIds.some(
          (id: number) =>
            !Number.isInteger(id) || id <= 0
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid image IDs.",
          },
          { status: 400 }
        );
      }

      /*
      -----------------------------------------------------
      التأكد أن الصور كلها تابعة للـ Group
      -----------------------------------------------------
      */

      const placeholders = orderedIds
        .map(() => "?")
        .join(",");

      const [rows] = await db.execute(
        `
          SELECT id
          FROM portfolio_images
          WHERE group_id = ?
            AND id IN (${placeholders})
        `,
        [groupId, ...orderedIds]
      );

      const existingImages = rows as Array<{
        id: number;
      }>;

      if (existingImages.length !== orderedIds.length) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One or more images do not belong to this group.",
          },
          { status: 400 }
        );
      }

      /*
      -----------------------------------------------------
      تحديث الترتيب
      -----------------------------------------------------
      */

      const connection = await db.getConnection();

      try {
        await connection.beginTransaction();

        for (
          let index = 0;
          index < orderedIds.length;
          index++
        ) {
          await connection.execute(
            `
              UPDATE portfolio_images
              SET
                display_order = ?,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
                AND group_id = ?
            `,
            [
              index,
              orderedIds[index],
              groupId,
            ]
          );
        }

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

      return NextResponse.json({
        success: true,
        message: "Image order saved successfully.",
      });
    }

    /*
    -------------------------------------------------------
    تعديل صورة واحدة
    -------------------------------------------------------
    */

    const id = Number(body.id);

    const displayOrder =
      body.displayOrder !== undefined
        ? Number(body.displayOrder)
        : undefined;

    const isVisible =
      body.isVisible !== undefined
        ? Boolean(body.isVisible)
        : undefined;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Image ID is required.",
        },
        { status: 400 }
      );
    }

    const [images] = await db.execute(
      `
        SELECT id
        FROM portfolio_images
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    if ((images as unknown[]).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found.",
        },
        { status: 404 }
      );
    }

    const updates: string[] = [];
    const values: (number | boolean)[] = [];

    if (
      displayOrder !== undefined &&
      Number.isInteger(displayOrder) &&
      displayOrder >= 0
    ) {
      updates.push("display_order = ?");
      values.push(displayOrder);
    }

    if (isVisible !== undefined) {
      updates.push("is_visible = ?");
      values.push(isVisible);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No changes were provided.",
        },
        { status: 400 }
      );
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    values.push(id);

    await db.execute(
      `
        UPDATE portfolio_images
        SET
          ${updates.join(", ")}
        WHERE id = ?
      `,
      values
    );

    return NextResponse.json({
      success: true,
      message: "Image updated successfully.",
    });
  } catch (error) {
    console.error("Admin images PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update image.",
      },
      { status: 500 }
    );
  }
}

/*
=========================================================
DELETE
حذف الصورة من Cloudinary + MySQL
=========================================================
*/

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
          message: "Image ID is required.",
        },
        { status: 400 }
      );
    }

    const [rows] = await db.execute(
      `
        SELECT
          id,
          public_id
        FROM portfolio_images
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    );

    const image =
      (
        rows as Array<{
          id: number;
          public_id: string;
        }>
      )[0];

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found.",
        },
        { status: 404 }
      );
    }

    const [result] = await db.execute(
      `
        DELETE FROM portfolio_images
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
          message: "Image was not deleted.",
        },
        { status: 400 }
      );
    }

    if (image.public_id) {
      try {
        await cloudinary.uploader.destroy(
          image.public_id,
          {
            resource_type: "image",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete Cloudinary image:",
          cloudinaryError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    console.error("Admin images DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete image.",
      },
      { status: 500 }
    );
  }
}