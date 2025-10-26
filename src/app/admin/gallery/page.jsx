"use client";
import { useState, useEffect } from "react";

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumId, setAlbumId] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🟢 Load albums + images
  async function loadAlbums() {
    try {
      const res = await fetch("/api/albums", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAlbums(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("⚠️ Failed to load albums:", err);
    }
  }

  async function loadImages() {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load gallery images");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching gallery:", err);
      setMessage("⚠️ Could not fetch gallery images.");
    }
  }

  useEffect(() => {
    loadAlbums();
    loadImages();
  }, []);

  // 🟡 Upload multiple images
  async function handleUpload(e) {
    e.preventDefault();
    if (!files.length) return setMessage("❌ Please select at least one image.");

    setLoading(true);
    setMessage("");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("caption", caption || "");
        formData.append("image", file);
        if (albumId) formData.append("albumId", albumId);

        const res = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
      }

      setCaption("");
      setFiles([]);
      setAlbumId("");
      setMessage("✅ All images uploaded successfully!");
      await loadImages();
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage(`❌ ${err.message || "Upload failed."}`);
    } finally {
      setLoading(false);
    }
  }

  // 🟠 Create new album
  async function handleCreateAlbum(e) {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAlbumName }),
      });
      if (res.ok) {
        setNewAlbumName("");
        setMessage("✅ Album created!");
        await loadAlbums();
      } else {
        setMessage("❌ Failed to create album.");
      }
    } catch (err) {
      console.error("❌ Album create error:", err);
      setMessage("❌ Server error while creating album.");
    }
  }

  // 🔴 Delete image
  async function handleDeleteImage(id) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Image deleted successfully.");
        await loadImages();
      } else {
        setMessage("❌ Failed to delete image.");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage("❌ Server error while deleting image.");
    }
  }

  // 🧹 Delete album (and its images)
  async function handleDeleteAlbum(id) {
    if (!confirm("Delete this album and all its images?")) return;
    try {
      const res = await fetch(`/api/albums?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Album deleted successfully.");
        await loadAlbums();
        await loadImages();
      } else {
        setMessage("❌ Failed to delete album.");
      }
    } catch (err) {
      console.error("❌ Album delete error:", err);
      setMessage("❌ Server error while deleting album.");
    }
  }

  // 🖼️ Set album cover (thumbnail) — instant UI update
  async function handleSetCover(albumId, imageUrl) {
    try {
      const res = await fetch(`/api/albums?id=${albumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverUrl: imageUrl }),
      });

      if (res.ok) {
        setMessage("✅ Album cover updated!");

        // ✅ Instant UI update
        setAlbums((prev) =>
          prev.map((a) => (a.id === albumId ? { ...a, coverUrl: imageUrl } : a))
        );

        setImages((prev) =>
          prev.map((img) =>
            img.albumId === albumId
              ? { ...img, isCover: img.imageUrl === imageUrl }
              : img
          )
        );
      } else {
        const err = await res.json();
        setMessage(`❌ ${err.error || "Failed to update cover."}`);
      }
    } catch (err) {
      console.error("❌ Cover update error:", err);
      setMessage("❌ Server error while setting cover.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Gallery Albums</h1>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.startsWith("✅") || message.startsWith("🗑️")
              ? "text-green-400"
              : message.startsWith("⚠️")
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* 🎵 Create Album */}
      <form onSubmit={handleCreateAlbum} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="New album name"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Album
        </button>
      </form>

      {/* 🗂 Album List */}
      {albums.length > 0 && (
        <div className="mb-10 space-y-3">
          <h2 className="text-xl font-semibold mb-2">Existing Albums</h2>
          {albums.map((album) => (
            <div
              key={album.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded"
            >
              <span className="text-sm flex items-center gap-2">
                {album.name}
                {album.coverUrl && (
                  <span className="text-green-400 text-xs">(Cover Set)</span>
                )}
              </span>
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete Album
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🖼️ Upload Form */}
      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-gray-800 p-4 rounded-lg mb-10"
      >
        <select
          value={albumId}
          onChange={(e) => setAlbumId(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="">No Album (Standalone Image)</option>
          {albums.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles([...e.target.files])}
          className="w-full text-white"
        />

        {files.length > 0 && (
          <p className="text-sm text-gray-400">{files.length} file(s) selected</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-brand-primary/90 disabled:opacity-50 transition"
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>
      </form>

      {/* 🖼️ Gallery Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {images.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">
            No images uploaded yet.
          </p>
        ) : (
          images.map((img) => {
            const album = albums.find((a) => a.id === img.albumId);
            const isCover = album?.coverUrl === img.imageUrl;

            return (
              <div
                key={img.id}
                className={`bg-gray-900 rounded-lg overflow-hidden relative group ${
                  isCover ? "ring-2 ring-green-500" : ""
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Gallery image"}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {isCover && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Cover
                  </span>
                )}

                <div className="p-3 border-t border-gray-800 space-y-2">
                  {img.caption && (
                    <p className="text-sm text-gray-300 mb-1">{img.caption}</p>
                  )}
                  {img.albumId && (
                    <p className="text-xs text-gray-400 italic">
                      Album: {album?.name || "N/A"}
                    </p>
                  )}
                  {img.albumId &&
                    (isCover ? (
                      <button
                        disabled
                        className="text-xs bg-green-600 px-2 py-1 rounded cursor-default"
                      >
                        ✅ Cover Set
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleSetCover(img.albumId, img.imageUrl)
                        }
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                      >
                        Set as Cover
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-90 hover:opacity-100 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
