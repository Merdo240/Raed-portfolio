"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type Group = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  cover_image_public_id: string | null;
  display_order: number;
  is_visible: boolean;
};

type UploadedImage = {
  url: string | null;
  publicId: string | null;
};

export default function GroupsManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImagePublicId, setCoverImagePublicId] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  async function loadGroups() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/groups", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load groups.");
        return;
      }

      setGroups(data.groups || []);
    } catch (error) {
      console.error("Load groups error:", error);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadGroups();
  }, []);


  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }


  function clearMessages() {
    setMessage("");
    setError("");
  }


  function startEditing(group: Group) {
    clearMessages();

    setEditingId(group.id);

    setName(group.name);
    setDescription(group.description || "");

    setCoverImage(null);

    setCoverImageUrl(group.cover_image_url || "");
    setCoverImagePublicId(group.cover_image_public_id || "");

    setPreviewUrl(group.cover_image_url || "");
  }


  function cancelEditing() {
    clearMessages();

    setEditingId(null);

    setName("");
    setDescription("");

    setCoverImage(null);
    setCoverImageUrl("");
    setCoverImagePublicId("");

    setPreviewUrl("");
  }


  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    clearMessages();

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WEBP and GIF images are allowed."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size cannot exceed 10 MB.");

      event.target.value = "";
      return;
    }

    setCoverImage(file);

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  }


  function removeSelectedImage() {
    setCoverImage(null);

    setPreviewUrl(coverImageUrl);

    const input =
      document.getElementById(
        "cover-image-input"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }


  async function uploadCoverImage(): Promise<UploadedImage> {
    if (!coverImage) {
      return {
        url: coverImageUrl || null,
        publicId: coverImagePublicId || null,
      };
    }

    const formData = new FormData();

    formData.append("file", coverImage);

    const response = await fetch(
      "/api/admin/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to upload image."
      );
    }

    return {
      url: data.image.url,
      publicId: data.image.publicId,
    };
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearMessages();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Group name is required.");
      return;
    }

    const slug = createSlug(cleanName);

    if (!slug) {
      setError(
        "The group name must contain English letters or numbers."
      );
      return;
    }

    setSaving(true);

    try {
      const uploadedImage =
        await uploadCoverImage();

      const response = await fetch(
        "/api/admin/groups",
        {
          method: editingId ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: editingId,

            name: cleanName,

            slug,

            description:
              description.trim() || null,

            coverImageUrl:
              uploadedImage.url,

            coverImagePublicId:
              uploadedImage.publicId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Operation failed."
        );
      }

      setMessage(
        editingId
          ? "Group updated successfully."
          : "Group created successfully."
      );

      setEditingId(null);

      setName("");
      setDescription("");

      setCoverImage(null);
      setCoverImageUrl("");
      setCoverImagePublicId("");
      setPreviewUrl("");

      const input =
        document.getElementById(
          "cover-image-input"
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      await loadGroups();

    } catch (error) {
      console.error(
        "Save group error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save group."
      );
    } finally {
      setSaving(false);
    }
  }


  async function deleteGroup(group: Group) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${group.name}"?`
      );

    if (!confirmed) {
      return;
    }

    clearMessages();

    setDeletingId(group.id);

    try {
      const response = await fetch(
        "/api/admin/groups",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: group.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete group."
        );
      }

      if (editingId === group.id) {
        cancelEditing();
      }

      setMessage(
        "Group deleted successfully."
      );

      await loadGroups();

    } catch (error) {
      console.error(
        "Delete group error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete group."
      );
    } finally {
      setDeletingId(null);
    }
  }


  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

      {/* Add / Edit */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#071A2F]">
            {editingId
              ? "Edit Group"
              : "Add Group"}
          </h2>

          <p className="mt-1 text-sm text-[#5B6B7F]">
            {editingId
              ? "Update the selected portfolio group."
              : "Create a new portfolio category."}
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#071A2F]">
              Group Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Advertising"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-[#00B8D9]"
            />
          </div>


          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#071A2F]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Creative advertising projects..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-[#00B8D9]"
            />
          </div>


          {/* Cover Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#071A2F]">
              Cover Image
            </label>

            <input
              id="cover-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
            />

            <p className="mt-2 text-xs text-[#5B6B7F]">
              JPG, PNG, WEBP or GIF — maximum 10 MB.
            </p>
          </div>


          {/* Image Preview */}
          {previewUrl && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-[#071A2F]">
                  Preview
                </span>

                {coverImage && (
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove selected
                  </button>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="h-48 w-full object-cover"
                />
              </div>

              {coverImage && (
                <p className="mt-2 truncate text-xs text-[#5B6B7F]">
                  {coverImage.name}
                </p>
              )}
            </div>
          )}


          {/* Messages */}
          {message && (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#071A2F] px-4 py-3 font-medium text-white transition hover:bg-[#0D2947] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Create Group"}
            </button>


            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-3 font-medium text-[#071A2F] transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>


      {/* Groups */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#071A2F]">
            Portfolio Groups
          </h2>

          <p className="mt-1 text-sm text-[#5B6B7F]">
            {groups.length} group
            {groups.length !== 1
              ? "s"
              : ""}
          </p>
        </div>


        {loading ? (

          <div className="py-12 text-center text-sm text-[#5B6B7F]">
            Loading groups...
          </div>

        ) : groups.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <p className="text-sm text-[#5B6B7F]">
              No groups yet.
            </p>
          </div>

        ) : (

          <div className="space-y-3">

            {groups.map((group) => (

              <div
                key={group.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
              >

                <div className="flex min-w-0 items-center gap-4">

                  {/* Thumbnail */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">

                    {group.cover_image_url ? (

                      <img
                        src={group.cover_image_url}
                        alt={group.name}
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                        No Image
                      </div>

                    )}

                  </div>


                  {/* Info */}
                  <div className="min-w-0">

                    <h3 className="truncate font-semibold text-[#071A2F]">
                      {group.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-[#5B6B7F]">
                      /portfolio/
                      {group.slug}
                    </p>

                  </div>

                </div>


                {/* Actions */}
                <div className="flex shrink-0 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(group)
                    }
                    disabled={
                      deletingId === group.id
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-[#071A2F] transition hover:border-[#00B8D9] hover:text-[#00B8D9] disabled:opacity-50"
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      deleteGroup(group)
                    }
                    disabled={
                      deletingId === group.id
                    }
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === group.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}