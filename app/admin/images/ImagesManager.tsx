"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type Group = {
  id: number;
  name: string;
  slug: string;
};

type PortfolioImage = {
  id: number;
  group_id: number;
  image_url: string;
  public_id: string;
  display_order: number;
  is_visible: boolean;
};

function SortableImageCard({
  image,
  onToggleVisibility,
  onDelete,
}: {
  image: PortfolioImage;
  onToggleVisibility: (
    image: PortfolioImage
  ) => void;
  onDelete: (
    image: PortfolioImage
  ) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden rounded-xl border bg-white ${
        isDragging
          ? "border-[#00B8D9] shadow-xl"
          : image.is_visible
            ? "border-slate-200"
            : "border-red-200 opacity-60"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center justify-between border-b border-slate-100 px-3 py-2 active:cursor-grabbing"
      >
        <span className="text-xs font-medium text-[#5B6B7F]">
          Position {image.display_order + 1}
        </span>

        <span className="text-[#5B6B7F]">
          ⋮⋮
        </span>
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={image.image_url}
          alt=""
          draggable={false}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 p-3">
        <button
          type="button"
          onClick={() =>
            onToggleVisibility(image)
          }
          className="text-xs font-medium text-[#071A2F] hover:text-[#00B8D9]"
        >
          {image.is_visible
            ? "Hide"
            : "Show"}
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(image)
          }
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ImagesManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [images, setImages] = useState<
    PortfolioImage[]
  >([]);

  const [selectedGroupId, setSelectedGroupId] =
    useState<number | null>(null);

  const [files, setFiles] = useState<File[]>(
    []
  );

  const [loadingGroups, setLoadingGroups] =
    useState(true);

  const [loadingImages, setLoadingImages] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
);

const [savingOrder, setSavingOrder] =
  useState(false);

  function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id) {
    return;
  }

  setImages((currentImages) => {
    const oldIndex = currentImages.findIndex(
      (image) => image.id === active.id
    );

    const newIndex = currentImages.findIndex(
      (image) => image.id === over.id
    );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return currentImages;
    }

    const reordered = arrayMove(
      currentImages,
      oldIndex,
      newIndex
    );

    return reordered.map(
      (image, index) => ({
        ...image,
        display_order: index,
      })
    );
  });

  setMessage("");
  setError("");
}

async function saveImageOrder() {
  if (!selectedGroupId) {
    return;
  }

  setSavingOrder(true);
  setMessage("");
  setError("");

  try {
    const response = await fetch(
      "/api/admin/images",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: selectedGroupId,
          orderedIds: images.map(
            (image) => image.id
          ),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to save image order."
      );
    }

    setMessage(
      "Image order saved successfully."
    );

    await loadImages(
      selectedGroupId
    );
  } catch (error) {
    console.error(
      "Save image order error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Failed to save image order."
    );
  } finally {
    setSavingOrder(false);
  }
}


  /*
  ========================================================
  تحميل المجموعات
  ========================================================
  */

  async function loadGroups() {
    try {
      setLoadingGroups(true);
      setError("");

      const response = await fetch(
        "/api/admin/groups",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load groups."
        );
      }

      setGroups(data.groups || []);

    } catch (error) {
      console.error(
        "Load groups error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load groups."
      );

    } finally {
      setLoadingGroups(false);
    }
  }


  /*
  ========================================================
  تحميل الصور
  ========================================================
  */

  async function loadImages(
    groupId: number
  ) {
    try {
      setLoadingImages(true);
      setError("");

      const response = await fetch(
        `/api/admin/images?groupId=${groupId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load images."
        );
      }

      setImages(data.images || []);

    } catch (error) {
      console.error(
        "Load images error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load images."
      );

    } finally {
      setLoadingImages(false);
    }
  }


  /*
  ========================================================
  البداية
  ========================================================
  */

  useEffect(() => {
    loadGroups();
  }, []);


  /*
  ========================================================
  عند اختيار Group
  ========================================================
  */

  useEffect(() => {
    if (!selectedGroupId) {
      setImages([]);
      return;
    }

    loadImages(selectedGroupId);
  }, [selectedGroupId]);


  /*
  ========================================================
  اختيار الصور
  ========================================================
  */

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setMessage("");
    setError("");

    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      setFiles([]);
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];


    const invalidFile =
      selectedFiles.find(
        (file) =>
          !allowedTypes.includes(
            file.type
          )
      );


    if (invalidFile) {
      setError(
        `Invalid image type: ${invalidFile.name}`
      );

      event.target.value = "";
      return;
    }


    const maxSize =
      10 * 1024 * 1024;


    const oversizedFile =
      selectedFiles.find(
        (file) => file.size > maxSize
      );


    if (oversizedFile) {
      setError(
        `${oversizedFile.name} is larger than 10 MB.`
      );

      event.target.value = "";
      return;
    }


    setFiles(selectedFiles);
  }


  /*
  ========================================================
  رفع الصور
  ========================================================
  */

  async function uploadImages() {
    if (!selectedGroupId) {
      setError(
        "Please select a group first."
      );
      return;
    }

    if (files.length === 0) {
      setError(
        "Please select at least one image."
      );
      return;
    }


    setUploading(true);
    setMessage("");
    setError("");


    try {
      let successfulUploads = 0;


      for (const file of files) {

        /*
        -----------------------------------------------
        1. رفع الصورة إلى Cloudinary
        -----------------------------------------------
        */

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );


        const uploadResponse =
          await fetch(
            "/api/admin/upload",
            {
              method: "POST",
              body: formData,
            }
          );


        const uploadData =
          await uploadResponse.json();


        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message ||
              `Failed to upload ${file.name}.`
          );
        }


        /*
        -----------------------------------------------
        2. تسجيل الصورة في MySQL
        -----------------------------------------------
        */

        const imageResponse =
          await fetch(
            "/api/admin/images",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                groupId:
                  selectedGroupId,

                imageUrl:
                  uploadData.image.url,

                publicId:
                  uploadData.image.publicId,
              }),
            }
          );


        const imageData =
          await imageResponse.json();


        if (!imageResponse.ok) {
          throw new Error(
            imageData.message ||
              `Failed to save ${file.name}.`
          );
        }


        successfulUploads++;
      }


      setMessage(
        `${successfulUploads} image${
          successfulUploads !== 1
            ? "s"
            : ""
        } uploaded successfully.`
      );


      setFiles([]);


      const input =
        document.getElementById(
          "portfolio-images-input"
        ) as HTMLInputElement | null;


      if (input) {
        input.value = "";
      }


      await loadImages(
        selectedGroupId
      );

    } catch (error) {
      console.error(
        "Upload images error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload images."
      );

    } finally {
      setUploading(false);
    }
  }


  /*
  ========================================================
  حذف صورة
  ========================================================
  */

  async function deleteImage(
    image: PortfolioImage
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );


    if (!confirmed) {
      return;
    }


    setMessage("");
    setError("");


    try {
      const response =
        await fetch(
          "/api/admin/images",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: image.id,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete image."
        );
      }


      setMessage(
        "Image deleted successfully."
      );


      if (selectedGroupId) {
        await loadImages(
          selectedGroupId
        );
      }

    } catch (error) {
      console.error(
        "Delete image error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete image."
      );
    }
  }


  /*
  ========================================================
  إظهار / إخفاء
  ========================================================
  */

  async function toggleVisibility(
    image: PortfolioImage
  ) {
    setMessage("");
    setError("");


    try {
      const response =
        await fetch(
          "/api/admin/images",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: image.id,

              isVisible:
                !image.is_visible,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update image."
        );
      }


      if (selectedGroupId) {
        await loadImages(
          selectedGroupId
        );
      }

    } catch (error) {
      console.error(
        "Toggle visibility error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update image."
      );
    }
  }


  return (
    <div className="space-y-8">

      {/* =================================================
          Header
      ================================================= */}

      <section>
        <h1 className="text-2xl font-bold text-[#071A2F]">
          Portfolio Images
        </h1>

        <p className="mt-1 text-sm text-[#5B6B7F]">
          Manage the images inside each portfolio group.
        </p>
      </section>


      {/* =================================================
          Controls
      ================================================= */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="grid gap-6 lg:grid-cols-[280px_1fr_auto]">

          {/* Group */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#071A2F]">
              Select Group
            </label>

            <select
              value={
                selectedGroupId ?? ""
              }
              onChange={(event) =>
                setSelectedGroupId(
                  event.target.value
                    ? Number(
                        event.target.value
                      )
                    : null
                )
              }
              disabled={loadingGroups}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#00B8D9]"
            >

              <option value="">
                Select a group
              </option>

              {groups.map(
                (group) => (
                  <option
                    key={group.id}
                    value={group.id}
                  >
                    {group.name}
                  </option>
                )
              )}

            </select>
          </div>


          {/* Files */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#071A2F]">
              Images
            </label>

            <input
              id="portfolio-images-input"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={
                handleFileChange
              }
              disabled={
                !selectedGroupId ||
                uploading
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />

            <p className="mt-2 text-xs text-[#5B6B7F]">
              You can select multiple images. Maximum 10 MB per image.
            </p>

          </div>


          {/* Upload */}
          <div className="flex items-end">

            <button
              type="button"
              onClick={uploadImages}
              disabled={
                !selectedGroupId ||
                files.length === 0 ||
                uploading
              }
              className="w-full rounded-lg bg-[#071A2F] px-6 py-3 font-medium text-white transition hover:bg-[#0D2947] disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${
                    files.length > 0
                      ? `(${files.length})`
                      : ""
                  }`}
            </button>

          </div>

        </div>


        {/* Selected files */}
        {files.length > 0 && (
          <div className="mt-5 rounded-lg bg-slate-50 p-4">

            <p className="mb-2 text-sm font-medium text-[#071A2F]">
              Selected Images
            </p>

            <div className="space-y-1">

              {files.map(
                (file) => (
                  <p
                    key={`${file.name}-${file.size}`}
                    className="truncate text-xs text-[#5B6B7F]"
                  >
                    {file.name}
                  </p>
                )
              )}

            </div>

          </div>
        )}

      </section>


      {/* =================================================
          Messages
      ================================================= */}

      {message && (
        <div className="rounded-xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* =================================================
          Images
      ================================================= */}

      <section className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between gap-4">
  <div>
    <h2 className="text-xl font-bold text-[#071A2F]">
      Images
    </h2>

    <p className="mt-1 text-sm text-[#5B6B7F]">
      {selectedGroupId
        ? `${images.length} image${
            images.length !== 1
              ? "s"
              : ""
          }`
        : "Select a group to view images."}
    </p>
  </div>

  {selectedGroupId &&
    images.length > 1 && (
      <button
        type="button"
        onClick={saveImageOrder}
        disabled={savingOrder}
        className="rounded-lg bg-[#00B8D9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#009DB9] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {savingOrder
          ? "Saving..."
          : "Save Order"}
      </button>
    )}
</div>

        {!selectedGroupId ? (

          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">

            <p className="text-sm text-[#5B6B7F]">
              Select a portfolio group first.
            </p>

          </div>

        ) : loadingImages ? (

          <div className="py-12 text-center text-sm text-[#5B6B7F]">
            Loading images...
          </div>

        ) : images.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">

            <p className="text-sm text-[#5B6B7F]">
              This group has no images yet.
            </p>

          </div>

        ) : (

          <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={images.map(
      (image) => image.id
    )}
    strategy={rectSortingStrategy}
  >
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <SortableImageCard
          key={image.id}
          image={image}
          onToggleVisibility={
            toggleVisibility
          }
          onDelete={deleteImage}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>

        )}

      </section>

    </div>
  );
}