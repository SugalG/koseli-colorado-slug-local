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
  const [selectedAlbum, setSelectedAlbum] = useState(null); // 👈 controls view mode

  // ========== LOADERS ==========
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

  async function loadImages(albumFilter = null) {
    try {
      const url = albumFilter ? `/api/gallery?albumId=${albumFilter}` : "/api/gallery";
      const res = await fetch(url, { cache: "no-store" });
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

  // ========== HANDLERS ==========
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
      } else setMessage("❌ Failed to create album.");
    } catch (err) {
      console.error("❌ Album create error:", err);
      setMessage("❌ Server error while creating album.");
    }
  }

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
        if (selectedAlbum) formData.append("albumId", selectedAlbum.id);
        else if (albumId) formData.append("albumId", albumId);

        const res = await fetch("/api/gallery", { method: "POST", body: formData });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }
      }
      setCaption("");
      setFiles([]);
      setAlbumId("");
      setMessage("✅ All images uploaded successfully!");
      await loadImages(selectedAlbum ? selectedAlbum.id : null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage(`❌ ${err.message || "Upload failed."}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteImage(id) {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Image deleted successfully.");
        await loadImages(selectedAlbum ? selectedAlbum.id : null);
      } else setMessage("❌ Failed to delete image.");
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage("❌ Server error while deleting image.");
    }
  }

  async function handleDeleteAlbum(id) {
    if (!confirm("Delete this album and all its images?")) return;
    try {
      const res = await fetch(`/api/albums?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Album deleted successfully.");
        await loadAlbums();
        await loadImages();
      } else setMessage("❌ Failed to delete album.");
    } catch (err) {
      console.error("❌ Album delete error:", err);
      setMessage("❌ Server error while deleting album.");
    }
  }

  async function handleSetCover(albumId, imageUrl) {
    try {
      const res = await fetch(`/api/albums?id=${albumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverUrl: imageUrl }),
      });
      if (res.ok) {
        setMessage("✅ Album cover updated!");
        setAlbums((prev) =>
          prev.map((a) => (a.id === albumId ? { ...a, coverUrl: imageUrl } : a))
        );
        if (selectedAlbum?.id === albumId)
          setSelectedAlbum((prev) => ({ ...prev, coverUrl: imageUrl }));
      } else {
        const err = await res.json();
        setMessage(`❌ ${err.error || "Failed to update cover."}`);
      }
    } catch (err) {
      console.error("❌ Cover update error:", err);
      setMessage("❌ Server error while setting cover.");
    }
  }

  // ========== UI ==========
  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
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

      {/* ---------- Album Grid ---------- */}
      {!selectedAlbum && (
        <>
          <form onSubmit={handleCreateAlbum} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="New album name"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Create Album
            </button>
          </form>

          {albums.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={async () => {
                    setSelectedAlbum(album);
                    await loadImages(album.id);
                  }}
                  className="bg-gray-900 rounded-lg overflow-hidden group relative cursor-pointer"
                >
                  <img
                    src={album.coverUrl || "/placeholder.jpg"}
                    alt={album.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all"></div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-semibold text-lg">{album.name}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAlbum(album.id);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-10">No albums yet.</p>
          )}
        </>
      )}

      {/* ---------- Album Detail View ---------- */}
      {selectedAlbum && (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setSelectedAlbum(null);
                loadImages();
              }}
              className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-2 rounded"
            >
              ← Back to Albums
            </button>
            <h2 className="text-xl font-semibold">Album: {selectedAlbum.name}</h2>
          </div>

          <form onSubmit={handleUpload} className="space-y-4 bg-gray-800 p-4 rounded-lg mb-10">
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
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-brand-primary/90 disabled:opacity-50 transition"
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          </form>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {images.length === 0 ? (
              <p className="text-gray-400 col-span-full text-center">
                No images in this album yet.
              </p>
            ) : (
              images.map((img) => {
                const isCover = selectedAlbum.coverUrl === img.imageUrl;
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
                    <div className="p-3 border-t border-gray-800 space-y-2">
                      {img.caption && <p className="text-sm text-gray-300">{img.caption}</p>}
                      {isCover ? (
                        <button
                          disabled
                          className="text-xs bg-green-600 px-2 py-1 rounded cursor-default"
                        >
                          ✅ Cover Set
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetCover(selectedAlbum.id, img.imageUrl)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                        >
                          Set as Cover
                        </button>
                      )}
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
        </>
      )}
    </div>
  );
}
