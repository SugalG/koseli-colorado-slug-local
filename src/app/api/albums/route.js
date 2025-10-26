import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🟢 GET all albums (with their images)
export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

// 🟡 POST new album
export async function POST(req) {
  try {
    const { name, coverUrl } = await req.json();
    if (!name)
      return NextResponse.json(
        { error: "Album name is required" },
        { status: 400 }
      );

    const album = await prisma.album.create({
      data: { name, coverUrl: coverUrl || null },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error("Error creating album:", error);
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}

// 🟠 PATCH album cover (set thumbnail)
export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { coverUrl } = await req.json();

    if (!id || !coverUrl) {
      return NextResponse.json(
        { error: "Album ID and coverUrl are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.album.update({
      where: { id },
      data: { coverUrl },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating album cover:", error);
    return NextResponse.json(
      { error: "Failed to update album cover" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE album (and its images)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "Album ID required" }, { status: 400 });

    // ✅ Delete all related images first (to avoid FK constraint)
    await prisma.galleryImage.deleteMany({ where: { albumId: id } });

    // ✅ Then delete the album itself
    await prisma.album.delete({ where: { id } });

    return NextResponse.json({ ok: true, message: "Album deleted" });
  } catch (error) {
    console.error("Error deleting album:", error);
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 }
    );
  }
}
